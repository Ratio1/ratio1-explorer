import HeroEpochCard from '@/components/HeroEpochCard';
import { Skeleton } from '@heroui/skeleton';
import { Suspense } from 'react';
import R1MintedLastEpoch from './R1MintedLastEpoch';
import { CardBordered } from './shared/cards/CardBordered';
import { CardHorizontal } from './shared/cards/CardHorizontal';
import R1TotalSupply from './shared/R1TotalSupply';

export default async function Hero({ nodesTotalItems }) {
    return (
        <div className="w-full">
            <CardBordered>
                <div className="text-[26px] font-bold">Nodes</div>

                <div className="col gap-3">
                    <div className="flexible-row">
                        <CardHorizontal label="Active Nodes" value={nodesTotalItems} isFlexible />

                        <CardHorizontal
                            label={
                                <div>
                                    <span className="font-semibold text-primary">$R1</span> total supply
                                </div>
                            }
                            value={<R1TotalSupply />}
                            isFlexible
                        />

                        <Suspense fallback={<Skeleton className="min-h-[76px] w-full max-w-[380px] rounded-xl" />}>
                            <CardHorizontal
                                label={
                                    <div>
                                        <span className="font-semibold text-primary">$R1</span> minted last epoch
                                    </div>
                                }
                                value={<R1MintedLastEpoch />}
                                isFlexible
                            />
                        </Suspense>
                    </div>

                    <div className="flexible-row">
                        <HeroEpochCard />
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
