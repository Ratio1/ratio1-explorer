import Node from '@/app/server-components/Nodes/Node';
import ParamsPagination from '@/components/shared/ParamsPagination';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
import NodeListGNDCard from './NodeListGNDCard';

export default async function List({
    nodes,
    pagesCount,
    currentPage,
}: {
    nodes: {
        [key: string]: types.NodeState;
    };
    pagesCount: number;
    currentPage: number;
}) {
    return (
        <div className="list-wrapper">
            <div id="list" className="list">
                <ListHeader>
                    <div className="min-w-[130px]">Alias</div>
                    <div className="min-w-[164px]">Addresses</div>
                    <div className="min-w-[244px]">License</div>
                    <div className="min-w-[112px]">Owner</div>
                    <div className="min-w-[50px]">Version</div>
                    <div className="min-w-[152px]">Last Epoch Availability</div>
                </ListHeader>

                {currentPage === 1 && (
                    <Suspense fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}>
                        <NodeListGNDCard />
                    </Suspense>
                )}

                {Object.entries(nodes).map(([ratio1Addr, node]) => (
                    <Suspense
                        key={`${currentPage}-${ratio1Addr}`}
                        fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}
                    >
                        <Node ratio1Addr={ratio1Addr as types.R1Address} node={node} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={pagesCount} />
        </div>
    );
}
