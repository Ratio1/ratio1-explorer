import ParamsPagination from '@/components/Nodes/ParamsPagination';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
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
        <div className="list-wrapper">
            <div id="list" className="list">
                <ListHeader useFixedWidthSmall>
                    <div className="min-w-[260px]">Address</div>
                    <div className="min-w-[188px]">Licenses Owned (ND / MND)</div>
                    <div className="min-w-[128px]">Wallet $R1 Balance</div>
                    <div className="min-w-[118px]">Last Claim Epoch</div>
                </ListHeader>

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
