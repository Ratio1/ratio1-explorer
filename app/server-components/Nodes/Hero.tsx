import HeroEpochCard from '@/components/Hero/HeroEpochCard';
import { fN } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { round } from 'lodash';
import { Suspense, cache, memo } from 'react';
import R1MintedLastEpoch from '../R1MintedLastEpoch';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import R1TotalSupply from '../shared/R1TotalSupply';

// Memoized component for props-dependent parts
const HeroStats = memo(
    ({ nodesTotalItems, resourcesTotal }: { nodesTotalItems: number; resourcesTotal: types.ResourcesTotal }) => (
        <>
            <CardHorizontal label="Licensed Nodes" value={nodesTotalItems} isFlexible widthClasses="min-w-[196px]" />

            <CardHorizontal
                label="CPU Cores Available"
                value={`${round(resourcesTotal.cpu_cores_avail, 0)}/${round(resourcesTotal.cpu_cores, 0)}`}
                isFlexible
                widthClasses="min-w-[316px]"
            />

            <CardHorizontal
                label="Memory Available"
                value={
                    <div className="leading-tight">
                        {fN(round(resourcesTotal.mem_avail, 0))}/{fN(round(resourcesTotal.mem_total, 0))}{' '}
                        <span className="text-slate-500">GB</span>
                    </div>
                }
                isFlexible
                widthClasses="min-w-[282px]"
            />

            <CardHorizontal
                label="Disk Available"
                value={
                    <div className="leading-tight">
                        {fN(round(resourcesTotal.disk_avail, 0))}/{fN(round(resourcesTotal.disk_total, 0))}{' '}
                        <span className="text-slate-500">GB</span>
                    </div>
                }
                isFlexible
                widthClasses="min-w-[290px]"
            />
        </>
    ),
);

HeroStats.displayName = 'HeroStats';

const CachedHeroContent = cache(async () => (
    <>
        <CardHorizontal
            label={
                <div>
                    <span className="font-semibold text-primary">$R1</span> total supply
                </div>
            }
            value={<R1TotalSupply />}
            isFlexible
            widthClasses="min-[420px]:min-w-[330px] md:max-w-[350px]"
        />

        <Suspense fallback={<Skeleton className="min-h-[76px] w-full min-w-[300px] flex-1 rounded-xl md:max-w-[340px]" />}>
            <CardHorizontal
                label={
                    <div>
                        <span className="font-semibold text-primary">$R1</span> minted last epoch
                    </div>
                }
                value={<R1MintedLastEpoch />}
                isFlexible
                widthClasses="min-w-[300px]"
            />
        </Suspense>

        <HeroEpochCard />
    </>
));

export default async function Hero({
    nodesTotalItems,
    resourcesTotal,
}: {
    nodesTotalItems: number;
    resourcesTotal: types.ResourcesTotal;
}) {
    return (
        <div id="hero" className="w-full">
            <BorderedCard>
                <div className="card-title-big font-bold">Nodes</div>

                <div className="flexible-row">
                    <HeroStats nodesTotalItems={nodesTotalItems} resourcesTotal={resourcesTotal} />
                    <CachedHeroContent />
                </div>
            </BorderedCard>
        </div>
    );
}
