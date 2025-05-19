'use client';

import { CardWithIcon } from '@/app/server-components/shared/cards/CardWithIcon';
import { RowWithIcon } from '@/app/server-components/shared/cards/RowWithIcon';
import { Config, getCurrentEpoch, getNextEpochTimestamp } from '@/config';
import { getClientConfig } from '@/config/clientConfig';
import { differenceInSeconds, formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { RiTimeLine } from 'react-icons/ri';

export default function TopBarEpochCard() {
    const [config, setConfig] = useState<Config>();
    const [currentEpoch, setCurrentEpoch] = useState<number>();

    // Init
    useEffect(() => {
        const { config } = getClientConfig();
        setConfig(config);
    }, []);

    useEffect(() => {
        if (config) {
            setCurrentEpoch(getCurrentEpoch(config));
        }
    }, [config]);

    useEffect(() => {
        if (currentEpoch && config) {
            setTimeout(
                () => {
                    setCurrentEpoch(getCurrentEpoch(config));
                },
                (differenceInSeconds(getNextEpochTimestamp(config), new Date()) + 1) * 1000,
            );
        }
    }, [currentEpoch]);

    if (!config) {
        return null;
    }

    return (
        <>
            <div className="hidden sm:block">
                <CardWithIcon icon={<RiTimeLine />} label={`${formatDistanceToNow(getNextEpochTimestamp(config))} left`}>
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
