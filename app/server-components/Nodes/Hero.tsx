import HeroEpochCard from '@/components/Hero/HeroEpochCard';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { round } from 'lodash';
import { Suspense } from 'react';
import R1MintedLastEpoch from '../R1MintedLastEpoch';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import R1TotalSupply from '../shared/R1TotalSupply';

export default async function Hero({
    nodesTotalItems,
    resourcesTotal,
}: {
    nodesTotalItems: number;
    resourcesTotal: types.ResourcesTotal;
}) {
    return (
        <div className="w-full">
            <BorderedCard>
                <div className="card-title-big font-bold">Nodes</div>

                <div className="flexible-row">
                    <CardHorizontal label="Active Nodes" value={nodesTotalItems} isFlexible widthClasses="min-w-[200px]" />

                    <CardHorizontal
                        label="CPU Cores Available"
                        value={
                            <div>
                                {round(resourcesTotal.cpu_cores_avail, 0)}/{resourcesTotal.cpu_cores}
                            </div>
                        }
                        isFlexible
                        widthClasses="min-w-[290px]"
                    />

                    <CardHorizontal
                        label="Memory Available (GB)"
                        value={
                            <div>
                                {round(resourcesTotal.mem_avail, 0)}/{round(resourcesTotal.mem_total, 0)}
                            </div>
                        }
                        isFlexible
                        widthClasses="min-w-[308px]"
                    />

                    <CardHorizontal
                        label="Disk Available (GB)"
                        value={
                            <div>
                                {round(resourcesTotal.disk_avail, 0)}/{round(resourcesTotal.disk_total, 0)}
                            </div>
                        }
                        isFlexible
                        widthClasses="min-w-[296px]"
                    />

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

                    <Suspense
                        fallback={<Skeleton className="min-h-[76px] w-full min-w-[340px] flex-1 rounded-xl md:max-w-[320px]" />}
                    >
                        <CardHorizontal
                            label={
                                <div>
                                    <span className="font-semibold text-primary">$R1</span> minted last epoch
                                </div>
                            }
                            value={<R1MintedLastEpoch />}
                            isFlexible
                            widthClasses="min-w-[340px]"
                        />
                    </Suspense>

                    <HeroEpochCard />
                </div>
            </BorderedCard>
        </div>
    );
}
