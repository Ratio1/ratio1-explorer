import NodesPagination from '@/components/Nodes/NodesPagination';
import * as types from '@/typedefs/blockchain';
import { R1Address } from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import Node from './Node';

export default async function List({
    nodes,
    pagesCount,
}: {
    nodes: {
        [key: string]: types.NodeState;
    };
    pagesCount: number;
}) {
    console.log('List nodes', nodes);

    return (
        <div className="col flex-1 justify-between gap-8">
            <div className="col w-full gap-2">
                {Object.entries(nodes)

                    .map(([ratio1Addr, node]) => (
                        <div key={ratio1Addr}>
                            <Suspense fallback={<Skeleton className="min-h-[88px] w-full rounded-2xl" />}>
                                <Node ratio1Addr={ratio1Addr as R1Address} node={node} />
                            </Suspense>
                        </div>
                    ))}
            </div>

            <NodesPagination total={pagesCount} />
        </div>
    );
}
