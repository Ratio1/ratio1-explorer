import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { cachedGetActiveNodes } from '@/lib/api';
import { getNodeLastEpoch } from '@/lib/api/oracles';
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

    let response: types.OraclesAvailabilityResult & types.OraclesDefaultResult;

    try {
        response = await getLastEpoch(nodeEthAddr);
    } catch (error) {
        notFound();
    }

    return {
        title: `${response.node_alias} | Ratio1 Explorer`,
        openGraph: {
            title: `${response.node_alias} | Ratio1 Explorer`,
        },
    };
}

const getLastEpoch = cache(async (nodeEthAddr: string) => {
    const response = await getNodeLastEpoch(nodeEthAddr as types.EthAddress);
    return response;
});

export default async function NodePage({ params }) {
    const { nodeEthAddr } = await params;

    let lastEpochResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
    let nodeResponse: types.OraclesDefaultResult;
    let node: types.NodeState | undefined;

    try {
        lastEpochResponse = await getLastEpoch(nodeEthAddr);
        nodeResponse = await cachedGetActiveNodes();

        node = Object.values(nodeResponse.result.nodes)
            .slice(1)
            .find((node) => node.eth_addr == nodeEthAddr);

        if (!node) {
            notFound();
        }

        console.log('[NodePage] Node', node);
        console.log('[NodePage] Last Epoch', lastEpochResponse);
    } catch (error) {
        notFound();
    }

    return (
        <div className="w-full">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">{node.alias}</div>

                        <div className="col gap-3">
                            <div className="flex flex-wrap items-stretch gap-3">
                                <CardFlexible hasFlex>
                                    <div className="col w-full gap-0.5 px-6 py-6">
                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">ETH Address</div>
                                            <CopyableAddress value={node.eth_addr} size={8} isLarge />
                                        </div>

                                        <div className="row justify-between gap-12 font-medium leading-none">
                                            <div className="text-[15px] text-slate-500">Internal Address</div>
                                            <CopyableAddress
                                                value={lastEpochResponse.node as types.R1Address}
                                                size={8}
                                                isLarge
                                            />
                                        </div>
                                    </div>
                                </CardFlexible>

                                <CardHorizontal label="Score" value={node.score} isSmall />

                                <CardHorizontal
                                    label="Last Epoch Availability"
                                    value={`${parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%`}
                                    hasFlex
                                    isSmall
                                />
                            </div>

                            <div className="flex flex-wrap items-stretch gap-3">
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
                                    isSmall
                                />

                                <CardHorizontal
                                    label="First Check"
                                    value={new Date(node.first_check).toLocaleString()}
                                    isSmall
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full text-sm font-medium text-slate-400">{node.ver}</div>
                </div>
            </CardBordered>
        </div>
    );
}
