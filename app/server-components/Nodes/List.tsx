import NodesPagination from '@/components/Nodes/NodesPagination';
import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import { Suspense } from 'react';
import Node from './Node';

export default async function List({ currentPage }: { currentPage: number }) {
    const response: types.OraclesDefaultResult = await getActiveNodes(currentPage);

    const nodes: {
        [key: string]: NodeState;
    } = response.result.nodes;

    const pagesCount = response.result.nodes_total_pages;

    // console.log(`Nodes (p${currentPage})`, Object.entries(nodes));

    return (
        <div className="col flex-1 justify-between gap-8">
            <div className="col w-full gap-2">
                {Object.entries(nodes)

                    .map(([ratio1Addr, node]) => (
                        <div key={ratio1Addr}>
                            <Suspense>
                                <Node ratio1Addr={ratio1Addr as R1Address} node={node} />
                            </Suspense>
                        </div>
                    ))}
            </div>

            <NodesPagination total={pagesCount} />
        </div>
    );
}
