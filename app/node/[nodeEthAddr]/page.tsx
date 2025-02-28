import { Alert } from '@/app/server-components/shared/Alert';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { Tag } from '@/app/server-components/shared/Tag';
import EpochsChart from '@/components/Nodes/EpochsChart';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getCurrentEpoch, getLicenseFirstCheckEpoch } from '@/config';
import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { getNodeEpochsRange, getNodeLastEpoch } from '@/lib/api/oracles';
import { arrayAverage, getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Tooltip } from '@heroui/tooltip';
import clsx from 'clsx';
import { formatDistanceToNow, subSeconds } from 'date-fns';
import { round } from 'lodash';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { RiCloseLine, RiEye2Line } from 'react-icons/ri';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr)) {
        notFound();
    }

    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        ({ nodeResponse } = await getCachedLicenseAndNode(nodeEthAddr));

        if (!nodeResponse) {
            notFound();
        }
    } catch (error) {
        console.error(error);
        notFound();
    }

    return {
        title: `Node • ${nodeResponse.node_alias} | Ratio1 Explorer`,
        openGraph: {
            title: `Node • ${nodeResponse.node_alias} | Ratio1 Explorer`,
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

const getCachedLicenseAndNode = cache(async (nodeEthAddr: types.EthAddress) => {
    const { licenseId, licenseType, owner, lastClaimEpoch, assignTimestamp } = await getNodeLicenseDetails(nodeEthAddr);
    const nodeResponse = await getNodeAvailability(nodeEthAddr, getLicenseFirstCheckEpoch(assignTimestamp), getCurrentEpoch());
    // console.log('[NodePage]', nodeResponse);

    return {
        licenseType,
        licenseId,
        owner,
        lastClaimEpoch,
        assignTimestamp,
        nodeResponse,
    };
});

export default async function NodePage({ params }) {
    const { nodeEthAddr } = await params;

    let nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    let licenseType: 'ND' | 'MND' | 'GND' | undefined;
    let licenseId: bigint | undefined;
    let owner: types.EthAddress | undefined;
    let lastClaimEpoch: bigint | undefined;
    let assignTimestamp: bigint | undefined;

    try {
        ({ nodeResponse, licenseType, licenseId, owner, lastClaimEpoch, assignTimestamp } =
            await getCachedLicenseAndNode(nodeEthAddr));
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
                        <div className="row gap-3">
                            <div className="text-[26px] font-bold">Node • {nodeResponse.node_alias}</div>

                            {nodeResponse.node_is_oracle && (
                                <Tag>
                                    <div className="row gap-1">
                                        <RiEye2Line className="text-lg" />
                                        <div className="text-[15px] font-medium">Oracle</div>
                                    </div>
                                </Tag>
                            )}
                        </div>

                        <div className="col gap-3">
                            {/* Row 1 */}
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardFlexible isFlexible>
                                    <div className="col w-full gap-0.5 px-6 py-6">
                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">ETH Address</div>
                                            <CopyableAddress value={nodeResponse.node_eth_address} size={8} isLarge />
                                        </div>

                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">Internal Address</div>
                                            <CopyableAddress value={nodeResponse.node as types.R1Address} size={8} isLarge />
                                        </div>
                                    </div>
                                </CardFlexible>

                                <CardHorizontal
                                    label="Status"
                                    value={
                                        <div className="row gap-1.5">
                                            <div
                                                className={clsx('h-3 w-3 rounded-full', {
                                                    'bg-teal-500': nodeResponse.node_is_online,
                                                    'bg-red-500': !nodeResponse.node_is_online,
                                                })}
                                            ></div>

                                            <div>{nodeResponse.node_is_online ? 'Online' : 'Offline'}</div>
                                        </div>
                                    }
                                    isSmall
                                />

                                <CardHorizontal
                                    label="Last Seen"
                                    value={
                                        <div>
                                            {formatDistanceToNow(subSeconds(new Date(), nodeResponse.node_last_seen_sec), {
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
                                <CardHorizontal label="Version" value={nodeResponse.node_version.split('|')[0]} isSmall />
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-sm font-medium text-slate-400">
                        {nodeResponse.node_version.replace(/\|(?=\S)/g, '| ')}
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
                                    value={`${parseFloat(((nodeResponse.epochs_vals[nodeResponse.epochs_vals.length - 1] * 100) / 255).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="Last Week Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="All Time Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />
                            </div>

                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal
                                    label="Active Epochs"
                                    value={nodeResponse.epochs_vals.filter((value) => value > 0).length}
                                    isSmall
                                />

                                <CardHorizontal
                                    label="Last 10 Epochs Availability"
                                    value={
                                        <div className="row gap-6">
                                            <div className="row gap-1">
                                                {nodeResponse.epochs_vals.slice(-10).map((val, index) => (
                                                    <div key={index}>
                                                        <Tooltip
                                                            content={
                                                                <div className="px-1 py-1.5 text-small">
                                                                    <div className="font-semibold">
                                                                        {round((val * 100) / 255, 2)}%
                                                                    </div>
                                                                    <div className="text-slate-500">
                                                                        Epoch {getCurrentEpoch() - 10 + index}
                                                                    </div>
                                                                </div>
                                                            }
                                                            closeDelay={0}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    'h-5 w-5 cursor-pointer rounded-md hover:opacity-70',
                                                                    {
                                                                        'bg-teal-500': val >= 200,
                                                                        'bg-yellow-500': val >= 100 && val < 200,
                                                                        'bg-red-500': val < 100,
                                                                    },
                                                                )}
                                                            ></div>
                                                        </Tooltip>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="h-[40px] w-[200px]">
                                                <EpochsChart
                                                    data={nodeResponse.epochs_vals.slice(-10).map((value, index, array) => ({
                                                        Availability: (100 * value) / 255,
                                                        Epoch: getCurrentEpoch() - array.length + index + 1,
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
