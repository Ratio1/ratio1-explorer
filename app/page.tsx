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
        tag?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;
    const currentTag = searchParams?.tag;

    try {
        const response: types.OraclesDefaultResult = await getActiveNodes(currentPage);

        const nodes: { [key: string]: types.NodeState } = response.result.nodes;

        const availableTags = Array.from(
            new Set(
                Object.values(nodes)
                    .flatMap((node) => node.tags ?? [])
                    .sort(),
            ),
        );

        const filteredNodes = currentTag
            ? Object.fromEntries(
                  Object.entries(nodes).filter(([, node]) => node.tags?.includes(currentTag)),
              )
            : nodes;

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
                    <List
                        nodes={filteredNodes}
                        pagesCount={pagesCount}
                        currentPage={currentPage}
                        availableTags={availableTags}
                        currentTag={currentTag}
                    />
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
