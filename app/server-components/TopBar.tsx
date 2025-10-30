import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import Search from '@/components/Search';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { layoutDataFunction } from '@/lib/actions';
import * as types from '@/typedefs/blockchain';
import { lazy, Suspense } from 'react';
import { RiCpuLine } from 'react-icons/ri';
import { RowWithIcon } from './shared/cards/RowWithIcon';
import PriceCard from './shared/PriceCard';

const LazyTopBarEpochCard = lazy(() => import('@/components/TopBarEpochCard'));

export default async function TopBar() {
    let activeNodes: types.OraclesDefaultResult | undefined;

    try {
        activeNodes = await layoutDataFunction();
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="flex w-full flex-col justify-between gap-4 md:gap-6 lg:flex-row lg:gap-12">
            <div className="w-full flex-1">
                <ClientWrapper>
                    <Search />
                </ClientWrapper>
            </div>

            <div className="flex-1">
                <div className="hidden flex-wrap items-center justify-between gap-2 sm:flex lg:flex-nowrap lg:justify-end lg:gap-3">
                    <Suspense>
                        <ClientWrapper>
                            <LazyTopBarEpochCard />
                        </ClientWrapper>
                    </Suspense>

                    <Suspense>
                        <PriceCard />
                    </Suspense>

                    {activeNodes && (
                        <CardWithIcon icon={<RiCpuLine />} label="Licensed Nodes">
                            {activeNodes.result.nodes_total_items}
                        </CardWithIcon>
                    )}
                </div>

                <div className="flex w-full flex-col gap-1.5 rounded-xl bg-slate-100 px-4 py-4 sm:hidden">
                    <Suspense>
                        <ClientWrapper>
                            <LazyTopBarEpochCard />
                        </ClientWrapper>
                    </Suspense>

                    <Suspense>
                        <PriceCard />
                    </Suspense>

                    {activeNodes && (
                        <RowWithIcon icon={<RiCpuLine />} label="Licensed Nodes">
                            {activeNodes.result.nodes_total_items}
                        </RowWithIcon>
                    )}
                </div>
            </div>
        </div>
    );
}
