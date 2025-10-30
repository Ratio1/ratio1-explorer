import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { Suspense } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import Hero from './server-components/Nodes/Hero';
import List from './server-components/Nodes/List';
import NodesListSkeleton from './server-components/Skeletons/NodesListSkeleton';
import { DetailedAlert } from './server-components/shared/DetailedAlert';

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
            <div className="center-all flex-1 py-4">
                <DetailedAlert
                    icon={<RiErrorWarningLine />}
                    title="API Issues"
                    description={
                        <div className="col">
                            <div>The Explorer is unable to retrieve node data at this time.</div>
                            <div>If the problem persists, please contact support.</div>
                        </div>
                    }
                />
            </div>
        );
    }
}
