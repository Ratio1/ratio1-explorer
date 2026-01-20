import ParamsPagination from '@/components/shared/ParamsPagination';
import { PAGE_SIZE } from '@/lib/api';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
import License from './License';

export default async function List({ licenses, currentPage }: { licenses: LicenseItem[]; currentPage: number }) {
    const getPage = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return licenses.slice(startIndex, endIndex);
    };

    return (
        <div className="list-wrapper">
            <div id="list" className="list">
                <ListHeader>
                    <div className="min-w-[244px]">License</div>
                    <div className="min-w-[34px]">Type</div>
                    <div className="min-w-[112px]">Owner</div>
                    <div className="min-w-[150px]">Assign Timestamp</div>
                    <div className="min-w-[256px]">Node</div>
                </ListHeader>

                {getPage().map((license) => (
                    <Suspense
                        key={`${currentPage}-${license.licenseType}-${license.licenseId}`}
                        fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}
                    >
                        <License licenseType={license.licenseType} licenseId={license.licenseId.toString()} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={Math.ceil(licenses.length / PAGE_SIZE)} />
        </div>
    );
}
