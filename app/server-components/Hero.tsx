import { EpochTimer } from '@/components/Hero/EpochTimer';
import { R1TotalSupply } from '@/components/Hero/R1TotalSupply';
import { getEpochStartTimestamp } from '@/config';
import { Skeleton } from '@heroui/skeleton';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { RiTimeLine } from 'react-icons/ri';
import R1MintedLastEpoch from './R1MintedLastEpoch';
import { CardBordered } from './shared/cards/CardBordered';
import { CardFlexible } from './shared/cards/CardFlexible';
import { CardHorizontal } from './shared/cards/CardHorizontal';

export default async function Hero({ currentEpoch, nodesTotalItems }) {
    return (
        <div className="w-full">
            <CardBordered>
                <div className="w-full bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">Nodes</div>

                        <div className="col gap-3">
                            <div className="row flex-wrap gap-3">
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

                                <Suspense fallback={<Skeleton className="min-h-[76px] w-full rounded-2xl" />}>
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

                            <div className="row flex-wrap gap-3">
                                <CardFlexible>
                                    <div className="row h-[76px] w-full justify-between gap-16 px-6 py-2">
                                        <div className="row gap-2">
                                            <div className="center-all rounded-full bg-blue-100 p-2.5 text-2xl text-primary">
                                                <RiTimeLine />
                                            </div>

                                            <div className="col gap-[5px]">
                                                <div className="text-[15px] font-medium leading-none text-slate-500">Epoch</div>
                                                <div className="font-semibold leading-none">{currentEpoch}</div>
                                            </div>
                                        </div>

                                        <div className="col gap-[5px]">
                                            <div className="text-[15px] font-medium leading-none text-slate-500">
                                                Started at
                                            </div>
                                            <div className="font-semibold leading-none">
                                                {format(getEpochStartTimestamp(currentEpoch), 'PP, kk:mm')}
                                            </div>
                                        </div>

                                        <div className="col gap-[5px]">
                                            <div className="text-[15px] font-medium leading-none text-slate-500">Time left</div>
                                            <div className="font-semibold leading-none">
                                                <EpochTimer />
                                            </div>
                                        </div>
                                    </div>
                                </CardFlexible>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBordered>
        </div>
    );
}
