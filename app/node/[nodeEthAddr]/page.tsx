import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { cachedGetActiveNodes } from '@/lib/api';
import { getNodeEpochsRange } from '@/lib/api/oracles';
import { arrayAverage } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { formatDistanceToNow, sub } from 'date-fns';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { isAddress } from 'viem';

export async function generateMetadata({ params }) {
    const { nodeEthAddr } = await params;

    if (!nodeEthAddr || !isAddress(nodeEthAddr)) {
        notFound();
    }

    let nodeResponse: types.OraclesDefaultResult;
    let node: types.NodeState | undefined;

    try {
        nodeResponse = await cachedGetActiveNodes(); // TODO: Replace with the getNode endpoint

        node = Object.values(nodeResponse.result.nodes)
            .slice(1)
            .find((node) => node.eth_addr == nodeEthAddr);

        if (!node) {
            console.log('Not found 1');
            notFound();
        }
    } catch (error) {
        console.log('Not found 2');
        notFound();
    }

    return {
        title: `${node.alias} | Ratio1 Explorer`,
        openGraph: {
            title: `${node.alias} | Ratio1 Explorer`,
        },
    };
}

const cachedGetEpochs = cache(async (nodeEthAddr: string, startEpoch: number, endEpoch: number) => {
    const response = await getNodeEpochsRange(nodeEthAddr as types.EthAddress, startEpoch, endEpoch);
    return response;
});

export default async function NodePage({ params }) {
    const { nodeEthAddr } = await params;

    let epochsResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    let nodeResponse: types.OraclesDefaultResult;
    let node: types.NodeState | undefined;

    try {
        nodeResponse = await cachedGetActiveNodes(); // TODO: Replace with the getNode endpoint
        const currentEpoch = nodeResponse.result.server_current_epoch;

        node = Object.values(nodeResponse.result.nodes)
            .slice(1)
            .find((node) => node.eth_addr == nodeEthAddr);

        if (!node) {
            console.log('Not found 3');
            notFound();
        }

        console.log('[NodePage] Node (cachedGetActiveNodes)', node);

        epochsResponse = await cachedGetEpochs(nodeEthAddr, 1, currentEpoch - 1);
        console.log('[NodePage] Epochs', epochsResponse);
    } catch (error) {
        console.log('Not found 4');
        notFound();
    }

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">{node.alias}</div>

                        <div className="col gap-3">
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardFlexible isFlexible>
                                    <div className="col w-full gap-0.5 px-6 py-6">
                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">ETH Address</div>
                                            <CopyableAddress value={node.eth_addr} size={8} isLarge />
                                        </div>

                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">Internal Address</div>
                                            <CopyableAddress value={epochsResponse.node as types.R1Address} size={8} isLarge />
                                        </div>
                                    </div>
                                </CardFlexible>

                                <CardHorizontal label="Score" value={node.score} isSmall />

                                <CardHorizontal
                                    label="Last Seen"
                                    value={
                                        <div className="text-lg">
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
                                    isFlexible
                                    isSmall
                                />
                            </div>

                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardHorizontal
                                    label="First Check"
                                    value={<div className="text-lg">{new Date(node.first_check).toLocaleString()}</div>}
                                    isSmall
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-sm font-medium text-slate-400">{node.ver}</div>
                </div>
            </CardBordered>

            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[22px] font-bold">Node Performance</div>

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
                                    value={`${parseFloat(((arrayAverage(epochsResponse.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />

                                <CardHorizontal
                                    label="All Time Avg. Availability"
                                    value={`${parseFloat(((arrayAverage(epochsResponse.epochs_vals) / 255) * 100).toFixed(2))}%`}
                                    isSmall
                                    isFlexible
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
