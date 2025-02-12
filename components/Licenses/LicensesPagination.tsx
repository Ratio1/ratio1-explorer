'use client';

import { Pagination } from '@heroui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const PAGE_SIZE = 10;

export default function LicensesPagination({ nodesCount }: { nodesCount: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const currentPage = Number(searchParams.get('page')) || 1;

    const onPageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mx-auto">
            <Pagination
                page={currentPage}
                onChange={(value) => {
                    onPageChange(value);
                }}
                classNames={{
                    wrapper: 'gap-0 overflow-visible h-8 rounded border border-divider',
                    item: 'w-8 h-8 text-small rounded-none bg-transparent',
                    cursor: 'bg-gradient-to-b from-primary-500 to-primary-600 rounded-md text-white font-bold',
                }}
                total={Math.ceil(nodesCount / PAGE_SIZE)}
            />
        </div>
    );
}
