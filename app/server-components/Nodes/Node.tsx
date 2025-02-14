import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import { formatDistanceToNow, sub } from 'date-fns';
import Link from 'next/link';
import { JSX } from 'react';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    const getNodeMainInfo = () => (
        <div className="row relative min-w-[140px]">
            <div className="absolute inset-y-0 my-0.5 w-1 rounded-full bg-primary"></div>

            <div className="col pl-3 font-medium">
                <CopyableAddress value={node.eth_addr} />
                <CopyableAddress value={ratio1Addr} />
            </div>
        </div>
    );

    return (
        <Link href={`${routePath.node}/${node.eth_addr}`}>
            <div className="flex w-full overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100 transition-all hover:border-[#e9ebf1]">
                <div className="row w-full justify-between gap-6 bg-white px-6 py-3">
                    <div className="w-[176px] overflow-hidden text-ellipsis whitespace-nowrap font-medium">{node.alias}</div>

                    {getNodeMainInfo()}

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
            </div>
        </Link>
    );
}

function Item({ label, value }: { label: string; value: JSX.Element }) {
    return (
        <div className="col text-sm font-medium">
            <div className="leading-5">{label}</div>
            <div className="leading-5 text-slate-400">{value}</div>
        </div>
    );
}
