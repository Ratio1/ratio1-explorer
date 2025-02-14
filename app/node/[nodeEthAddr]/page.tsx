import { BigCard } from '@/app/server-components/shared/BigCard';
import { Item } from '@/app/server-components/shared/Item';
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

    const getNodeMainInfo = (ethAddr: types.EthAddress, ratio1Addr: types.R1Address) => (
        <div className="row relative min-w-[140px]">
            <div className="absolute inset-y-0 my-0.5 w-1 rounded-full bg-primary"></div>

            <div className="col pl-3 font-medium">
                <CopyableAddress value={ethAddr} />
                <CopyableAddress value={ratio1Addr} />
            </div>
        </div>
    );

    return (
        <div className="col flex-1 gap-6">
            <BigCard
                label={
                    <div className="col">
                        <div className="text-[28px] font-bold">Node</div>
                        <div className="text-xl font-medium text-slate-500">{lastEpochResponse.node_alias}</div>
                    </div>
                }
            >
                <div className="col w-full gap-6 text-sm">
                    <div className="row justify-between gap-6">
                        {getNodeMainInfo(node.eth_addr, lastEpochResponse.node as types.R1Address)}

                        <Item
                            label="Last Seen"
                            value={
                                <>
                                    {formatDistanceToNow(
                                        sub(new Date(), {
                                            hours: parseInt(node.last_seen_ago.split(':')[0]),
                                            minutes: parseInt(node.last_seen_ago.split(':')[1]),
                                            seconds: parseInt(node.last_seen_ago.split(':')[2]),
                                        }),
                                        { addSuffix: true },
                                    )}
                                </>
                            }
                        />

                        <div className="min-w-[50px]">
                            <Item label="Score" value={<>{node.score}</>} />
                        </div>

                        <div className="min-w-[150px]">
                            <Item label="First Check" value={<>{new Date(node.first_check).toLocaleString()}</>} />
                        </div>

                        <Item
                            label="Last Epoch Availability"
                            value={<>{parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%</>}
                        />
                    </div>

                    <div className="text-right font-medium text-slate-400">{node.ver}</div>
                </div>
            </BigCard>
        </div>
    );
}
