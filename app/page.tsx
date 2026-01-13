import ActiveNodes from './server-components/Nodes/ActiveNodes';

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

    return <ActiveNodes currentPage={currentPage} />;
}
