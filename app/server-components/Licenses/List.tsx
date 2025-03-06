import ParamsPagination from '@/components/Nodes/ParamsPagination';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import License from './License';

const PAGE_SIZE = 12;

export default async function List({ licenses, currentPage }: { licenses: LicenseItem[]; currentPage: number }) {
    const getPage = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return licenses.slice(startIndex, endIndex);
    };

    console.log('[List]', { currentPage, array: getPage() });

    return (
        <div className="col flex-1 justify-between gap-8">
            <div className="group/list col w-full gap-2 overflow-x-auto">
                {getPage().map((license, index) => (
                    <Suspense key={index} fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}>
                        <License licenseType={license.licenseType} licenseId={license.licenseId.toString()} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={Math.ceil(licenses.length / PAGE_SIZE)} />
        </div>
    );
}
