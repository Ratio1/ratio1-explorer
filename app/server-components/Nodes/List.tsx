import NodesPagination from '@/components/Nodes/NodesPagination';
import { cachedGetActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import Node from './Node';

const PAGE_SIZE = 10;

export default async function List({ currentPage }: { currentPage: number }) {
    console.log('List received page', currentPage);

    const response: types.OraclesDefaultResult = await cachedGetActiveNodes();
    console.log('Active Nodes', response);

    const nodes: {
        [key: string]: NodeState;
    } = response.result.nodes;

    const getPaginatedEntries = () => {
        const array: [string, NodeState][] = Object.entries(nodes).slice(1);

        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        return array.slice(start, end);
    };

    return (
        <div className="col flex-1 justify-between gap-8">
            <div className="col w-full gap-2">
                {getPaginatedEntries().map(([ratio1Addr, node]) => (
                    <div key={ratio1Addr}>
                        <Node ratio1Addr={ratio1Addr as R1Address} node={node} />
                    </div>
                ))}
            </div>

            <NodesPagination pageSize={PAGE_SIZE} nodesCount={Object.keys(nodes).length - 1} />
        </div>
    );
}
