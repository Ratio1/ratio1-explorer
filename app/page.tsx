import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { Suspense } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import Hero from './server-components/Nodes/Hero';
import List from './server-components/Nodes/List';
import NodesListSkeleton from './server-components/Skeletons/NodesListSkeleton';
import { Alert } from './server-components/shared/Alert';

export default async function HomePage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    try {
        const response: types.OraclesDefaultResult = await getActiveNodes(currentPage);

        const nodes: {
            [key: string]: types.NodeState;
        } = response.result.nodes;

        const pagesCount: number = response.result.nodes_total_pages;

        // console.log(`[HomePage] getActiveNodes(${currentPage})`, response.result);

        return (
            <>
                <Hero
                    nodesTotalItems={response.result.nodes_total_items}
                    resourcesTotal={response.result.resources_total}
                    serverInfo={{
                        alias: response.result.server_alias,
                        version: response.result.server_version,
                    }}
                />

                <Suspense fallback={<NodesListSkeleton />}>
                    <List nodes={nodes} pagesCount={pagesCount} currentPage={currentPage} />
                </Suspense>
            </>
        );
    } catch (error) {
        console.log('Failed to fetch active nodes:', error);

        return (
            <div className="mx-auto w-full flex-1 px-4 py-8">
                <Alert
                    variant="warning"
                    icon={<RiErrorWarningLine className="text-lg" />}
                    title="Failed to fetch nodes"
                    description="An error occured while trying to fetch the active nodes. If the problem persists, please contact support."
                />
            </div>
        );
    }
}
