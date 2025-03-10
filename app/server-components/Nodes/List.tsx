import ParamsPagination from '@/components/Nodes/ParamsPagination';
import * as types from '@/typedefs/blockchain';
import { R1Address } from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
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
    return (
        <div className="col flex-1 justify-between gap-8">
            <div className="group/list col w-full gap-2 overflow-x-auto">
                <ListHeader>
                    <div className="min-w-[200px] lg:min-w-[228px]">Alias</div>
                    <div className="min-w-[164px]">Addresses</div>
                    <div className="min-w-[244px]">License</div>
                    <div className="min-w-[112px]">Owner</div>
                    <div className="min-w-[50px]">Version</div>
                    <div className="min-w-[152px]">Last Epoch Availability</div>
                </ListHeader>

                {Object.entries(nodes).map(([ratio1Addr, node]) => (
                    <div key={ratio1Addr}>
                        <Suspense fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}>
                            <Node ratio1Addr={ratio1Addr as R1Address} node={node} />
                        </Suspense>
                    </div>
                ))}
            </div>

            <ParamsPagination total={pagesCount} />
        </div>
    );
}
