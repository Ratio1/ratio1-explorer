'use client';

import { getNextEpochTimestamp } from '@/config';
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';
import { Timer } from './shared/Timer';

export const HeroEpochTimer = () => {
    const [timestamp, setTimestamp] = useState<Date>(getNextEpochTimestamp());

    return (
        <div className="text-xl font-semibold text-primary">
            {!timestamp ? (
                <Spinner size="sm" />
            ) : (
                <Timer
                    timestamp={timestamp}
                    callback={() => {
                        setTimestamp(getNextEpochTimestamp());
                    }}
                />
            )}
        </div>
    );
};
