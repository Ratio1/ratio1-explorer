import { EpochTimer } from '@/components/Hero/EpochTimer';
import { R1TotalSupply } from '@/components/Hero/R1TotalSupply';
import { getEpochStartTimestamp } from '@/config';
import { getActiveNodes } from '@/lib/api';
import * as types from '@/typedefs/blockchain';
import { format } from 'date-fns';
import { Suspense } from 'react';
import { RiTimeLine } from 'react-icons/ri';
import R1MintedLastEpoch from './R1MintedLastEpoch';
import { CardBordered } from './shared/cards/CardBordered';
import { CardFlexible } from './shared/cards/CardFlexible';
import { CardHorizontal } from './shared/cards/CardHorizontal';

export default async function Hero() {
    let activeNodes: types.OraclesDefaultResult;

    try {
        activeNodes = await getActiveNodes();
    } catch (error) {
        return null;
    }

    return (
        <div className="w-full">
            <CardBordered>
                <div className="w-full bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">Nodes</div>

                        <div className="col gap-3">
                            <div className="row flex-wrap gap-3">
                                <CardHorizontal label="Active Nodes" value={activeNodes.result.nodes_total_items} isFlexible />

                                <CardHorizontal
                                    label={
                                        <div>
                                            <span className="font-semibold text-primary">$R1</span> total supply
                                        </div>
                                    }
                                    value={<R1TotalSupply />}
                                    isFlexible
                                />

                                <CardHorizontal
                                    label={
                                        <div>
                                            <span className="font-semibold text-primary">$R1</span> minted last epoch
                                        </div>
                                    }
                                    value={
                                        <Suspense>
                                            <R1MintedLastEpoch />
                                        </Suspense>
                                    }
                                    isFlexible
                                />
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
                                                <div className="text-base font-semibold leading-none">
                                                    {activeNodes.result.server_current_epoch}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col gap-[5px]">
                                            <div className="text-[15px] font-medium leading-none text-slate-500">
                                                Started at
                                            </div>
                                            <div className="text-base font-semibold leading-none">
                                                {format(
                                                    getEpochStartTimestamp(activeNodes.result.server_current_epoch),
                                                    'PP, kk:mm',
                                                )}
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
