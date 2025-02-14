import { Suspense } from 'react';
import List from './server-components/Nodes/List';
import NodesListSkeleton from './server-components/Skeletons/NodesListSkeleton';

export default async function HomePage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <Suspense fallback={<NodesListSkeleton />}>
            <List currentPage={currentPage} />
        </Suspense>
    );
}
