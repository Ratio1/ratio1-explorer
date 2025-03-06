import ParamsPagination from '@/components/Nodes/ParamsPagination';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import Account from './Account';

const PAGE_SIZE = 10;

export default async function List({
    owners,
    currentPage,
}: {
    owners: {
        ethAddress: types.EthAddress;
        licenses: LicenseItem[];
    }[];
    currentPage: number;
}) {
    const getPage = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return owners.slice(startIndex, endIndex);
    };

    return (
        <div className="col flex-1 justify-between gap-8">
            <div className="group/list col w-full gap-2 overflow-x-auto">
                {getPage().map((item, index) => (
                    <Suspense key={index} fallback={<Skeleton className="min-h-[92px] w-full rounded-2xl" />}>
                        <Account ethAddress={item.ethAddress} licenses={item.licenses} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={Math.ceil(owners.length / PAGE_SIZE)} />
        </div>
    );
}
