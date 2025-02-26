'use client';

import { getNextEpochTimestamp } from '@/config';
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';
import { Timer } from '../shared/Timer';

export const EpochTimer = () => {
    const [timestamp, setTimestamp] = useState<Date>(getNextEpochTimestamp());

    return (
        <div className="text-lg leading-none text-primary">
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
