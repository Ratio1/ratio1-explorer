import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { Suspense } from 'react';
import Hero from './server-components/Hero';
import List from './server-components/Nodes/List';
import NodesListSkeleton from './server-components/Skeletons/NodesListSkeleton';

export default async function HomePage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    console.log('HomePage currentPage', currentPage);

    const response: types.OraclesDefaultResult = await getActiveNodes(currentPage);

    const nodes: {
        [key: string]: types.NodeState;
    } = response.result.nodes;

    const pagesCount: number = response.result.nodes_total_pages;

    return (
        <>
            <Hero currentEpoch={response.result.server_current_epoch} nodesTotalItems={response.result.nodes_total_items} />

            <Suspense fallback={<NodesListSkeleton />}>
                <List nodes={nodes} pagesCount={pagesCount} />
            </Suspense>
        </>
    );
}
