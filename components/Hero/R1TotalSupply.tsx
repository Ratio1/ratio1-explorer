'use client';

import { BlockchainContextType, useBlockchainContext } from '@/lib/contexts/blockchain';
import { useEffect } from 'react';
import { formatUnits } from 'viem';

export const R1TotalSupply = () => {
    const { R1TotalSupply, fetchR1TotalSupply } = useBlockchainContext() as BlockchainContextType;

    // Init
    useEffect(() => {
        fetchR1TotalSupply();
    }, []);

    return (
        <div className="text-xl text-primary">
            {R1TotalSupply !== undefined
                ? `${parseFloat(Number(formatUnits(R1TotalSupply, 18)).toFixed(3)).toLocaleString('en-US')}`
                : '...'}
        </div>
    );
};
