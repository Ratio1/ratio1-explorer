'use client';

import { BlockchainContextType, useBlockchainContext } from '@/lib/contexts/blockchain';
import { useEffect, useState } from 'react';

export const PriceCard = () => {
    const { r1Price, fetchR1Price } = useBlockchainContext() as BlockchainContextType;
    const [r1PriceUsd, setR1PriceUsd] = useState<number>();

    // Init
    useEffect(() => {
        fetchR1Price();
    }, []);

    useEffect(() => {
        if (r1Price) {
            const divisor = 10n ** BigInt(18);
            const scale = 1000000n;
            setR1PriceUsd(Number((r1Price * scale) / divisor) / Number(scale));
        }
    }, [r1Price]);

    return (
        <div className="col h-[52px] justify-center rounded-2xl bg-lightBlue px-4 py-1.5">
            <div className="font-semibold text-primary">{r1PriceUsd ? `$${parseFloat(r1PriceUsd.toFixed(2))}` : '...'}</div>
            <div className="text-xs leading-none text-slate-500">Current Price</div>
        </div>
    );
};
