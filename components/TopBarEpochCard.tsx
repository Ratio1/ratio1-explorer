'use client';

import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { RowWithIcon } from '@/app/server-components/shared/cards/RowWithIcon';
import { getCurrentEpoch, getNextEpochTimestamp } from '@/config';
import { differenceInSeconds, formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { RiTimeLine } from 'react-icons/ri';

export default function TopBarEpochCard() {
    const [currentEpoch, setCurrentEpoch] = useState<number>(getCurrentEpoch());

    useEffect(() => {
        if (currentEpoch) {
            setTimeout(
                () => {
                    setCurrentEpoch(getCurrentEpoch());
                },
                (differenceInSeconds(getNextEpochTimestamp(), new Date()) + 1) * 1000,
            );
        }
    }, [currentEpoch]);

    return (
        <>
            <div className="hidden sm:block">
                <CardWithIcon icon={<RiTimeLine />} label={`${formatDistanceToNow(getNextEpochTimestamp())} left`}>
                    <span className="font-medium text-body">Epoch</span> <span className="text-primary">{currentEpoch}</span>
                </CardWithIcon>
            </div>

            <div className="block sm:hidden">
                <RowWithIcon icon={<RiTimeLine />} label="Epoch">
                    {currentEpoch}
                </RowWithIcon>
            </div>
        </>
    );
}
