'use client';

import { getNextEpochTimestamp } from '@/config';
import { getClientConfig } from '@/config/clientConfig';
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';
import { Timer } from '../shared/Timer';

export const EpochTimer = () => {
    const { config } = getClientConfig();

    const [timestamp, setTimestamp] = useState<Date>(getNextEpochTimestamp(config));

    return (
        <div className="text-base leading-none text-primary">
            {!timestamp ? (
                <Spinner size="sm" />
            ) : (
                <Timer
                    timestamp={timestamp}
                    callback={() => {
                        setTimestamp(getNextEpochTimestamp(config));
                    }}
                />
            )}
        </div>
    );
};
