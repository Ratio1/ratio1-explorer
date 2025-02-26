import { Alert } from '@/app/server-components/shared/Alert';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import EpochsChart from '@/components/Nodes/EpochsChart';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getCurrentEpoch, getLicenseFirstCheckEpoch } from '@/config';
import {
    getMNDLicense,
    getNDLicense,
    getNodeToMNDLicenseId,
    getNodeToNDLicenseId,
    getOwnerOfLicense,
} from '@/lib/api/blockchain';
import { getNodeEpochsRange, getNodeLastEpoch } from '@/lib/api/oracles';
import { arrayAverage, getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import { formatDistanceToNow, subSeconds } from 'date-fns';
import { notFound } from 'next/navigation';
import { RiCloseLine } from 'react-icons/ri';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr)) {
        notFound();
    }

    let response: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined;

    try {
        // TODO: Maybe find a more efficient way to get the node alias
        response = await getNodeLastEpoch(nodeEthAddr);

        if (!response) {
            notFound();
        }
    } catch (error) {
        console.error(error);
        notFound();
    }

    return {
        title: `Node • ${response.node_alias} | Ratio1 Explorer`,
        openGraph: {
            title: `Node • ${response.node_alias} | Ratio1 Explorer`,
        },
    };
}

const getNodeAvailability = async (nodeEthAddr: types.EthAddress, firstCheckEpoch: number, currentEpoch: number) => {
    const response =
        firstCheckEpoch === currentEpoch
            ? await getNodeLastEpoch(nodeEthAddr)
            : await getNodeEpochsRange(nodeEthAddr, firstCheckEpoch, currentEpoch - 1);

    return response;
};

// const cachedGetNodeAvailability = cache(
//     async (nodeEthAddr: types.EthAddress, firstCheckEpoch: number, currentEpoch: number) => {
//         const response =
//             firstCheckEpoch === currentEpoch
//                 ? await getNodeLastEpoch(nodeEthAddr)
//                 : await getNodeEpochsRange(nodeEthAddr, firstCheckEpoch, currentEpoch - 1);

//         return response;
//     },
// );

export default async function NodePage({ params }) {
    const { nodeEthAddr } = await params;

    const currentEpoch: number = getCurrentEpoch();
    let response: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    let licenseType: 'ND' | 'MND' | 'GND' | undefined;
    let licenseId: bigint | undefined;
    let owner: types.EthAddress | undefined;
    let lastClaimEpoch: bigint | undefined;
    let assignTimestamp: bigint | undefined;

    try {
        const [ndLicenseId, mndLicenseId] = await Promise.all([
            getNodeToNDLicenseId(nodeEthAddr),
            getNodeToMNDLicenseId(nodeEthAddr),
        ]);

        licenseType = !mndLicenseId ? 'ND' : mndLicenseId === 1n ? 'GND' : 'MND';
        licenseId = mndLicenseId || ndLicenseId;

        owner = await getOwnerOfLicense(licenseId, licenseType);

        const licenseCall = licenseType === 'ND' ? getNDLicense : getMNDLicense;
        const license = await licenseCall(licenseId);

        console.log('[NodePage] License', license);

        lastClaimEpoch = license.lastClaimEpoch;
        assignTimestamp = license.assignTimestamp;

        response = await getNodeAvailability(nodeEthAddr, getLicenseFirstCheckEpoch(assignTimestamp), currentEpoch);

        if (!response) {
            throw new Error('Unable to fetch node availability.');
        }

        console.log('[NodePage]', response);
    } catch (error: any) {
        console.error(error);

        if (error.message.includes('Oracle state is not valid')) {
            return (
                <div className="center-all flex-1">
                    <Alert
                        icon={<RiCloseLine />}
                        title="Unexpected Error"
                        description={<div>Oracle state is not valid, please contact the development team.</div>}
                    />
                </div>
            );
        } else {
            notFound();
        }
    }

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">Node • {response.node_alias}</div>

                        <div className="col gap-3">
                            {/* Row 1 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardFlexible isFlexible>
                                    <div className="col w-full gap-0.5 px-6 py-6">
                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">ETH Address</div>
                                            <CopyableAddress value={response.node_eth_address} size={8} isLarge />
                                        </div>

                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">Internal Address</div>
                                            <CopyableAddress value={response.node as types.R1Address} size={8} isLarge />
                                        </div>
                                    </div>
                                </CardFlexible>

                                <CardHorizontal
                                    label="Status"
                                    value={
                                        <div className="row gap-1.5">
                                            <div
                                                className={clsx('h-3 w-3 rounded-full', {
                                                    'bg-teal-500': response.node_is_online,
                                                    'bg-red-500': !response.node_is_online,
                                                })}
                                            ></div>

                                            <div>{response.node_is_online ? 'Online' : 'Offline'}</div>
                                        </div>
                                    }
                                    isSmall
                                />

                                <CardHorizontal
                                    label="Last Seen"
                                    value={
                                        <div>
                                            {formatDistanceToNow(subSeconds(new Date(), response.node_last_seen_sec), {
                                                addSuffix: true,
                                            })}
                                        </div>
                                    }
                                    isSmall
                                    isFlexible
                                />
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal label="Version" value={response.node_version.split('|')[0]} isSmall />
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-sm font-medium text-slate-400">
                        {response.node_version.replace(/\|(?=\S)/g, '| ')}
                    </div>
                </div>
            </CardBordered>

            {/* License */}
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-2xl font-bold">License</div>

                        <div className="col gap-3">
                            {/* Row 1 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                {!!licenseType && <CardHorizontal label="Type" value={licenseType} isSmall />}

                                {!!licenseId && <CardHorizontal label="ID" value={licenseId.toString()} isSmall />}

                                {!!owner && <CardHorizontal label="Owner" value={getShortAddress(owner)} isSmall />}

                                {!!assignTimestamp && (
                                    <CardHorizontal
                                        label="Assign timestamp"
                                        value={new Date(Number(assignTimestamp) * 1000).toLocaleString()}
                                        isSmall
                                        isFlexible
                                    />
                                )}
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                {!!lastClaimEpoch && (
                                    <CardHorizontal label="Last claimed epoch" value={lastClaimEpoch.toString()} isSmall />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardBordered>

            {/* Performance */}
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-2xl font-bold">Performance</div>

                        <div className="col gap-3">
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal
                                    label="Last Epoch Availability"
                                    value={`${parseFloat(((response.epochs_vals[response.epochs_vals.length - 1] * 100) / 255).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="Last Week Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(response.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="All Time Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(response.epochs_vals) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />
                            </div>

                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal
                                    label="Active Epochs"
                                    value={response.epochs_vals.filter((value) => value > 0).length}
                                    isSmall
                                />

                                <CardHorizontal
                                    label="Last 10 Epochs Availability"
                                    value={
                                        <div className="row gap-6">
                                            <div className="row gap-1">
                                                {response.epochs_vals.slice(-10).map((val, index) => (
                                                    <div
                                                        key={index}
                                                        className={clsx('h-5 w-5 rounded-md', {
                                                            'bg-teal-500': val >= 200,
                                                            'bg-yellow-500': val >= 100 && val < 200,
                                                            'bg-red-500': val < 100,
                                                        })}
                                                    ></div>
                                                ))}
                                            </div>

                                            <div className="h-[40px] w-[200px]">
                                                <EpochsChart
                                                    data={response.epochs_vals.slice(-10).map((value, index, array) => ({
                                                        Availability: (100 * value) / 255,
                                                        Epoch: currentEpoch - array.length + index + 1,
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    }
                                    isSmall
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
