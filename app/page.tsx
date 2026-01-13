import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ActiveNodes from './server-components/Nodes/ActiveNodes';
import Hero from './server-components/Nodes/Hero';
import NodesListSkeleton from './server-components/Skeletons/NodesListSkeleton';

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
    const resolvedSearchParams = await searchParams;
    const pageParam = Number.parseInt(resolvedSearchParams?.page ?? '', 1);
    const canonical = Number.isFinite(pageParam) && pageParam > 1 ? `/?page=${pageParam}` : '/';

    return {
        alternates: {
            canonical,
        },
    };
}

export default async function HomePage(props: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <>
            <Suspense fallback={<Skeleton className="min-h-[304px] w-full rounded-2xl" />}>
                <Hero currentPage={currentPage} />
            </Suspense>

            <Suspense key={currentPage} fallback={<NodesListSkeleton />}>
                <ActiveNodes currentPage={currentPage} />
            </Suspense>
        </>
    );
}
