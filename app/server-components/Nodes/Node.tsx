import { CopyableValue } from '@/components/shared/CopyableValue';
import { getShortAddress } from '@/lib/utils';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import { formatDistanceToNow, sub } from 'date-fns';
import { JSX } from 'react';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    const getNodeMainInfo = () => (
        <div className="row relative min-w-[140px]">
            <div className="absolute inset-y-0 my-0.5 w-1 rounded-full bg-teal-500"></div>

            <div className="col pl-3.5 font-medium">
                <div className="max-w-[176px] overflow-hidden text-ellipsis whitespace-nowrap leading-5">{node.alias}</div>

                <CopyableValue value={getShortAddress(node.eth_addr)} />
                <CopyableValue value={getShortAddress(ratio1Addr)} />
            </div>
        </div>
    );

    return (
        <div className="flex w-full overflow-hidden rounded-2xl border-3 border-slate-100 bg-slate-100">
            <div className="flex w-full justify-between gap-6 bg-white px-5 py-4 md:gap-6">
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

                <Item label="Score" value={<>{node.score}</>} />

                <Item label="First Check" value={<>{new Date(node.first_check).toLocaleString()}</>} />

                <Item
                    label="Last Epoch Availability"
                    value={<>{parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%</>}
                />
            </div>
        </div>
    );
}

function Item({ label, value }: { label: string; value: JSX.Element }) {
    return (
        <div className="col font-medium">
            <div className="leading-5">{label}</div>
            <div className="text-sm leading-5 text-slate-400">{value}</div>
        </div>
    );
}
