'use client';

import { BlockchainContextType, useBlockchainContext } from '@/lib/contexts/blockchainContext';
import { useEffect } from 'react';
import { formatUnits } from 'viem';

export const R1MintedLastEpoch = () => {
    const { R1MintedLastEpoch, fetchR1MintedLastEpoch } = useBlockchainContext() as BlockchainContextType;

    // Init
    useEffect(() => {
        fetchR1MintedLastEpoch();
    }, []);

    return (
        <div className="text-xl text-primary">
            {R1MintedLastEpoch !== undefined
                ? `${parseFloat(Number(formatUnits(R1MintedLastEpoch, 18)).toFixed(3)).toLocaleString('en-US')}`
                : '...'}
        </div>
    );
};
