import ParamsPagination from '@/components/Nodes/ParamsPagination';
import { getPublicProfiles } from '@/lib/api/backend';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import ListHeader from '../shared/ListHeader';
import CSPCard from './CSPCard';

const PAGE_SIZE = 10;

export default async function CSPsList({ csps, currentPage }: { csps: readonly types.CSP[]; currentPage: number }) {
    const getPageEntries = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return csps.slice(startIndex, endIndex);
    };

    let entriesWithNames: types.CSP[] = [];

    try {
        const entries = getPageEntries();
        const publicProfiles = await getPublicProfiles(entries.map((item) => item.owner));

        entriesWithNames = entries.map((item) => ({
            ...item,
            name: publicProfiles.brands.find((profile) => profile.brandAddress === item.owner.toLowerCase())?.name,
        }));
    } catch (error) {
        console.error(error);
        console.log('[CSPsList] Failed to fetch branding data');
    }

    return (
        <div className="list-wrapper">
            <div id="list" className="list">
                <ListHeader useFixedWidthSmall>
                    <div className="min-w-[280px]">Owner</div>
                    <div className="min-w-[130px]">Escrow Address</div>
                    <div className="min-w-[100px]">TVL ($USDC)</div>
                    <div className="min-w-[100px]">Active Jobs</div>
                </ListHeader>

                {entriesWithNames.map((item, index) => (
                    <Suspense key={index} fallback={<Skeleton className="min-h-[68px] w-full rounded-2xl" />}>
                        <CSPCard csp={item} />
                    </Suspense>
                ))}
            </div>

            <ParamsPagination total={Math.ceil(csps.length / PAGE_SIZE)} />
        </div>
    );
}
