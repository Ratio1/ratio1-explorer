import ParamsPagination from '@/components/Nodes/ParamsPagination';
import { getPublicProfiles } from '@/lib/api/backend';
import * as types from '@/typedefs/blockchain';
import { LicenseItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
import NodeOperatorCard from './NodeOperatorCard';

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
    const getPageEntries = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return owners.slice(startIndex, endIndex);
    };

    let nodeOperators: {
        name?: string;
        ethAddress: types.EthAddress;
        licenses: LicenseItem[];
    }[] = [];

    try {
        const entries = getPageEntries();

        const publicProfiles = await getPublicProfiles(entries.map((item) => item.ethAddress));

        if (!publicProfiles.brands) {
            nodeOperators = entries;
        } else {
            nodeOperators = entries.map((item) => ({
                name: publicProfiles.brands.find((profile) => profile.brandAddress === item.ethAddress)?.name,
                ethAddress: item.ethAddress,
                licenses: item.licenses,
            }));
        }

        console.log(`[List] Page ${currentPage}`, { nodeOperators });
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="list-wrapper">
            <div id="list" className="list">
                <ListHeader useFixedWidthSmall>
                    <div className="min-w-[282px]">Name</div>
                    <div className="min-w-[188px]">Licenses Owned (ND / MND)</div>
                    <div className="min-w-[128px]">Wallet $R1 Balance</div>
                    <div className="min-w-[118px]">Last Claim Epoch</div>
                </ListHeader>

                {nodeOperators.map((item, index) => (
                    <Suspense key={index} fallback={<Skeleton className="min-h-[68px] w-full rounded-2xl" />}>
                        <NodeOperatorCard name={item.name} ethAddress={item.ethAddress} licenses={item.licenses} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={Math.ceil(owners.length / PAGE_SIZE)} />
        </div>
    );
}
