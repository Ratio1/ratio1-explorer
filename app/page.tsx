import { Skeleton } from '@heroui/skeleton';
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

    return (
        <>
            <Suspense fallback={<Skeleton className="min-h-[271px] w-full rounded-2xl" />}>
                <Hero />
            </Suspense>

            <Suspense fallback={<NodesListSkeleton />}>
                <List currentPage={currentPage} />
            </Suspense>
        </>
    );
}
