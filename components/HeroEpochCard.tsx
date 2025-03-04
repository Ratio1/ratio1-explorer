'use client';

import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { getCurrentEpoch, getEpochStartTimestamp, getNextEpochTimestamp } from '@/config';
import { differenceInSeconds, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { RiTimeLine } from 'react-icons/ri';
import { EpochTimer } from './Hero/EpochTimer';

export default function HeroEpochCard() {
    const [currentEpoch, setCurrentEpoch] = useState<number>(getCurrentEpoch());

    useEffect(() => {
        setTimeout(
            () => {
                setCurrentEpoch(getCurrentEpoch());
            },
            (differenceInSeconds(getNextEpochTimestamp(), new Date()) + 1) * 1000,
        );
    }, [currentEpoch]);

    return (
        <CardFlexible>
            <div className="row h-[76px] w-full justify-between gap-4 px-4 py-2 lg:gap-16 lg:px-6">
                <div className="row gap-2">
                    <div className="center-all rounded-full bg-blue-100 p-2.5 text-2xl text-primary">
                        <RiTimeLine />
                    </div>

                    <div className="col gap-[5px]">
                        <div className="text-[15px] font-medium leading-none text-slate-500">Epoch</div>
                        <div className="font-semibold leading-none">{currentEpoch}</div>
                    </div>
                </div>

                <div className="col web-only-flex gap-[5px]">
                    <div className="text-[15px] font-medium leading-none text-slate-500">Started at</div>
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
    );
}
