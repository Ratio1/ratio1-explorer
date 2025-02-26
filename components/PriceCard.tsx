'use client';

import { BlockchainContextType, useBlockchainContext } from '@/lib/contexts/blockchain';
import { useEffect, useState } from 'react';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { CardWithIcon } from '../app/server-components/shared/cards/CardWithIcon';

export const PriceCard = () => {
    const { r1Price, fetchR1Price, fetchMintedR1InLastEpoch } = useBlockchainContext() as BlockchainContextType;
    const [r1PriceUsd, setR1PriceUsd] = useState<number>();

    // Init
    useEffect(() => {
        fetchR1Price();
        fetchMintedR1InLastEpoch();
    }, []);

    useEffect(() => {
        if (r1Price) {
            const divisor = 10n ** BigInt(18);
            const scale = 1000000n;
            setR1PriceUsd(Number((r1Price * scale) / divisor) / Number(scale));
        }
    }, [r1Price]);

    return (
        <CardWithIcon icon={<RiMoneyDollarCircleLine />} label="Current Price">
            <div className="font-semibold leading-none text-primary">
                {r1PriceUsd ? `$${parseFloat(r1PriceUsd.toFixed(2))}` : '...'}
            </div>
        </CardWithIcon>
    );
};
