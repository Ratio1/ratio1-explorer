import ParamsPagination from '@/components/shared/ParamsPagination';
import { PAGE_SIZE } from '@/config';
import { LicenseListItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
import License from './License';

export default async function List({
    licenses,
    currentPage,
    totalLicenses,
}: {
    licenses: LicenseListItem[];
    currentPage: number;
    totalLicenses: number;
}) {
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

                {licenses.map((license) => (
                    <Suspense
                        key={`${currentPage}-${license.licenseType}-${license.licenseId}`}
                        fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}
                    >
                        <License license={license} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={Math.max(1, Math.ceil(totalLicenses / PAGE_SIZE))} />
        </div>
    );
}
