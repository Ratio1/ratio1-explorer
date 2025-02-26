import { Alert } from '@/app/server-components/shared/Alert';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import EpochsChart from '@/components/Nodes/EpochsChart';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getLicenseFirstCheckEpoch } from '@/config';
import { getActiveNodes } from '@/lib/api';
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
import { formatDistanceToNow, sub } from 'date-fns';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr)) {
        notFound();
    }

    let activeNodes: types.OraclesDefaultResult;
    let node: types.NodeState | undefined;

    try {
        activeNodes = await getActiveNodes(); // TODO: Replace with the node_epochs_range endpoint

        node = Object.values(activeNodes.result.nodes)
            .slice(1)
            .find((node) => node.eth_addr == nodeEthAddr);

        if (!node) {
            notFound();
        }
    } catch (error) {
        console.error(error);
        notFound();
    }

    return {
        title: `Node • ${node.alias} | Ratio1 Explorer`,
        openGraph: {
            title: `Node • ${node.alias} | Ratio1 Explorer`,
        },
    };
}

const cachedGetAvailability = cache(async (nodeEthAddr: types.EthAddress, firstCheckEpoch: number, currentEpoch: number) => {
    const response =
        firstCheckEpoch === currentEpoch
            ? await getNodeLastEpoch(nodeEthAddr)
            : await getNodeEpochsRange(nodeEthAddr, firstCheckEpoch, currentEpoch - 1);

    return response;
});

export default async function NodePage({ params }) {
    const { nodeEthAddr } = await params;

    let availabilityResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    let nodeResponse: types.OraclesDefaultResult;
    let node: types.NodeState | undefined;
    let currentEpoch: number;

    try {
        nodeResponse = await getActiveNodes(); // TODO: Replace with the getNode endpoint
        currentEpoch = nodeResponse.result.server_current_epoch;

        node = Object.values(nodeResponse.result.nodes)
            .slice(1)
            .find((node) => node.eth_addr == nodeEthAddr);

        if (!node) {
            notFound();
        }

        console.log('[NodePage] Node', node);

        availabilityResponse = await cachedGetAvailability(
            nodeEthAddr,
            getLicenseFirstCheckEpoch(new Date(node.first_check)),
            currentEpoch,
        );
        console.log('[NodePage] Availability', availabilityResponse);
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
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">Node • {node.alias}</div>

                        <div className="col gap-3">
                            {/* Row 1 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardFlexible isFlexible>
                                    <div className="col w-full gap-0.5 px-6 py-6">
                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">ETH Address</div>
                                            <CopyableAddress value={node.eth_addr} size={8} isLarge />
                                        </div>

                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">Internal Address</div>
                                            <CopyableAddress
                                                value={availabilityResponse.node as types.R1Address}
                                                size={8}
                                                isLarge
                                            />
                                        </div>
                                    </div>
                                </CardFlexible>

                                <CardHorizontal
                                    label="Status"
                                    value={
                                        <div className="row gap-1.5">
                                            <div
                                                className={clsx('h-3 w-3 rounded-full', {
                                                    'bg-teal-500': availabilityResponse.node_is_online,
                                                    'bg-red-500': !availabilityResponse.node_is_online,
                                                })}
                                            ></div>

                                            <div>{availabilityResponse.node_is_online ? 'Online' : 'Offline'}</div>
                                        </div>
                                    }
                                    isSmall
                                />

                                <CardHorizontal
                                    label="Last Seen"
                                    value={
                                        <div>
                                            {formatDistanceToNow(
                                                sub(new Date(), {
                                                    hours: parseInt(node.last_seen_ago.split(':')[0]),
                                                    minutes: parseInt(node.last_seen_ago.split(':')[1]),
                                                    seconds: parseInt(node.last_seen_ago.split(':')[2]),
                                                }),
                                                { addSuffix: true },
                                            )}
                                        </div>
                                    }
                                    isSmall
                                    isFlexible
                                />
                            </div>

                            {/* Row 2 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal label="Score" value={node.score} isSmall />

                                <CardHorizontal
                                    label="First Check"
                                    value={<div>{new Date(node.first_check).toLocaleString()}</div>}
                                    isSmall
                                />

                                <CardHorizontal label="Version" value={node.ver.split('|')[0]} isSmall />
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-sm font-medium text-slate-400">{node.ver?.replace(/\|(?=\S)/g, '| ')}</div>
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
                                    value={`${parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="Last Week Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(availabilityResponse.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="All Time Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(availabilityResponse.epochs_vals) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />
                            </div>

                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal label="Active Epochs" value={node.non_zero} isSmall />

                                <CardHorizontal
                                    label="Last 10 Epochs Availability"
                                    value={
                                        <div className="row gap-6">
                                            <div className="row gap-1">
                                                {availabilityResponse.epochs_vals.slice(-10).map((val, index) => (
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
                                                    data={availabilityResponse.epochs_vals
                                                        .slice(-10)
                                                        .map((value, index, array) => ({
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
