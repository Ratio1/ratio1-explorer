import LicensesPagination from '@/components/Licenses/LicensesPagination';
import { CopyableValue } from '@/components/shared/CopyableValue';
import { getShortAddress } from '@/lib/utils';
import { NodeState } from '@/typedefs/blockchain';
import clsx from 'clsx';
import { FunctionComponent, PropsWithChildren } from 'react';

export default async function List({
    nodes,
    currentPage,
}: {
    nodes: {
        [key: string]: NodeState;
    };
    currentPage: number;
}) {
    console.log(nodes);

    const getNodeMainInfo = (ratio1Addr: string, node: NodeState) => (
        <div className="row relative">
            <div
                className={clsx('absolute inset-y-0 w-1 rounded-full', {
                    'bg-teal-500':
                        node.last_seen_ago
                            .split(':')
                            .reduce((acc, time, i) => acc + parseInt(time) * (i === 0 ? 3600 : i === 1 ? 60 : 1), 0) < 300,
                    'bg-red-500':
                        node.last_seen_ago
                            .split(':')
                            .reduce((acc, time, i) => acc + parseInt(time) * (i === 0 ? 3600 : i === 1 ? 60 : 1), 0) >= 300,
                })}
            ></div>

            <div className="col pl-3.5 font-medium">
                <div className="max-w-[176px] overflow-hidden text-ellipsis whitespace-nowrap pb-[1px] leading-5">
                    {node.alias}
                </div>

                <CopyableValue value={getShortAddress(node.eth_addr)} />

                <CopyableValue value={getShortAddress(ratio1Addr)} />
            </div>
        </div>
    );

    const getPaginatedEntries = () => {
        const array: [string, NodeState][] = Object.entries(nodes).slice(1);

        const start = (currentPage - 1) * 10;
        const end = start + 10;

        return array.slice(start, end);
    };

    return (
        <div className="center-all col flex-1 gap-8">
            <div className="col w-full gap-2">
                {getPaginatedEntries().map(([ratio1Addr, node]) => (
                    <div
                        key={ratio1Addr}
                        className="flex w-full overflow-hidden rounded-2xl border-3 border-slate-100 bg-slate-100"
                    >
                        <div className="row w-full gap-4 bg-white px-5 py-4 md:gap-6">{getNodeMainInfo(ratio1Addr, node)}</div>
                    </div>
                ))}
            </div>

            <LicensesPagination nodesCount={Object.keys(nodes).length - 1} />
        </div>
    );
}

const Card: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <div className="flex h-[64px] w-full items-center rounded-2xl border-2 border-slate-100 px-4 py-2.5 sm:w-auto sm:justify-center">
        {children}
    </div>
);

const Tag: FunctionComponent<PropsWithChildren> = ({ children }) => (
    <div className="flex">
        <div className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600">{children}</div>
    </div>
);
