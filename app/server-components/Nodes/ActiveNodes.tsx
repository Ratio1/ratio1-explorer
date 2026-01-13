import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Suspense, cache } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import NodesListSkeleton from '../Skeletons/NodesListSkeleton';
import { DetailedAlert } from '../shared/DetailedAlert';
import Hero from './Hero';
import List from './List';

const getActiveNodesCached = cache(async (currentPage: number) => {
    try {
        const response: types.OraclesDefaultResult = await getActiveNodes(currentPage);
        return { response };
    } catch (error) {
        console.log('Failed to fetch active nodes:', error);
        return { error };
    }
});

async function ActiveNodesHero({ currentPage }: { currentPage: number }) {
    const { response } = await getActiveNodesCached(currentPage);

    if (!response) {
        return null;
    }

    return (
        <Hero
            nodesTotalItems={response.result.nodes_total_items}
            resourcesTotal={response.result.resources_total}
            serverInfo={{
                alias: response.result.server_alias,
                version: response.result.server_version,
            }}
        />
    );
}

async function ActiveNodesList({ currentPage }: { currentPage: number }) {
    const { response } = await getActiveNodesCached(currentPage);

    if (!response) {
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

    const nodes: {
        [key: string]: types.NodeState;
    } = response.result.nodes;

    const pagesCount: number = response.result.nodes_total_pages;

    return <List nodes={nodes} pagesCount={pagesCount} currentPage={currentPage} />;
}

export default function ActiveNodes({ currentPage }: { currentPage: number }) {
    return (
        <>
            <Suspense fallback={<Skeleton className="min-h-[304px] w-full rounded-2xl" />}>
                <ActiveNodesHero currentPage={currentPage} />
            </Suspense>

            <Suspense key={currentPage} fallback={<NodesListSkeleton />}>
                <ActiveNodesList currentPage={currentPage} />
            </Suspense>
        </>
    );
}
