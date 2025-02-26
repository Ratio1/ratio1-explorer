'use client';

import { differenceInSeconds, Duration, intervalToDuration } from 'date-fns';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';

const ZERO_DURATION = {
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
    months: 0,
    years: 0,
};

export const Timer: FunctionComponent<
    PropsWithChildren<{
        timestamp: Date;
        callback: () => void;
    }>
> = ({ timestamp, callback }) => {
    const [duration, setDuration] = useState<Duration>(ZERO_DURATION);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;

        setDuration(
            intervalToDuration({
                start: new Date(),
                end: timestamp,
            }),
        );

        // eslint-disable-next-line prefer-const
        timer = setInterval(() => {
            const difference = differenceInSeconds(timestamp, new Date());

            if (difference <= 0) {
                setDuration(ZERO_DURATION);
                clearInterval(timer);

                if (callback) {
                    callback();
                }

                return;
            }

            setDuration(
                intervalToDuration({
                    start: new Date(),
                    end: timestamp,
                }),
            );
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [timestamp]);

    return (
        <div className="roboto">
            {!!duration.hours && <span>{String(duration.hours || 0).padStart(2, '0')}h</span>}
            {String(duration.minutes || 0).padStart(2, '0')}m{String(duration.seconds || 0).padStart(2, '0')}s
        </div>
    );
};
