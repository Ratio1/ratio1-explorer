'use client';

import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { getCurrentEpoch, getNextEpochTimestamp } from '@/config';
import { differenceInSeconds, formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { RiTimeLine } from 'react-icons/ri';

export default function TopBarEpochCard() {
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
        <CardWithIcon icon={<RiTimeLine />} label={`${formatDistanceToNow(getNextEpochTimestamp())} left`}>
            <div className="pr-0.5 font-medium leading-none">
                Epoch <span className="font-semibold text-primary">{currentEpoch}</span>
            </div>
        </CardWithIcon>
    );
}
