import NodesPagination from '@/components/Nodes/NodesPagination';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import { FunctionComponent, PropsWithChildren } from 'react';
import Node from './Node';

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
                    <div key={ratio1Addr}>
                        <Node ratio1Addr={ratio1Addr as R1Address} node={node} />
                    </div>
                ))}
            </div>

            <NodesPagination nodesCount={Object.keys(nodes).length - 1} />
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
