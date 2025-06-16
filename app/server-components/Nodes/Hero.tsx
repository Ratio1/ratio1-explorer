import HeroEpochCard from '@/components/Hero/HeroEpochCard';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import R1MintedLastEpoch from '../R1MintedLastEpoch';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import R1TotalSupply from '../shared/R1TotalSupply';

export default async function Hero({ nodesTotalItems }) {
    return (
        <div className="w-full">
            <BorderedCard>
                <div className="card-title-big font-bold">Nodes</div>

                <div className="flexible-row">
                    <CardHorizontal label="Active Nodes" value={nodesTotalItems} isFlexible widthClasses="min-w-[192px]" />

                    <CardHorizontal
                        label={
                            <div>
                                <span className="font-semibold text-primary">$R1</span> total supply
                            </div>
                        }
                        value={<R1TotalSupply />}
                        isFlexible
                        widthClasses="min-[420px]:min-w-[346px]"
                    />

                    <Suspense fallback={<Skeleton className="min-h-[76px] w-full rounded-xl md:max-w-[380px]" />}>
                        <CardHorizontal
                            label={
                                <div>
                                    <span className="font-semibold text-primary">$R1</span> minted last epoch
                                </div>
                            }
                            value={<R1MintedLastEpoch />}
                            isFlexible
                            widthClasses="min-w-[254px]"
                        />
                    </Suspense>

                    <HeroEpochCard />
                </div>
            </BorderedCard>
        </div>
    );
}
