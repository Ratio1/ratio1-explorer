import config, { getNextEpochTimestamp } from '@/config';
import { getSSURL } from '@/lib/actions';
import { differenceInSeconds } from 'date-fns';
import { cache } from 'react';
import { formatUnits } from 'viem';

const fetchCachedR1MintedLastEpoch = cache(async () => {
    const url = await getSSURL(`r1-minted-last-epoch?env=${config.environment}`);

    const res = await fetch(url, {
        next: { revalidate: differenceInSeconds(getNextEpochTimestamp(), new Date()) + 1 },
    });

    const data: {
        value: string;
    } = await res.json();

    return data.value;
});

export default async function R1MintedLastEpoch() {
    let value: string | undefined;
    const alchemyUrl = `https://base-${config.environment === 'mainnet' ? 'mainnet' : 'sepolia'}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

    try {
        value = await fetchCachedR1MintedLastEpoch();
    } catch (error) {
        console.log('Error fetching R1 minted last epoch', alchemyUrl, error);
        return <div className="text-lg text-slate-600 md:text-xl">—</div>;
    }

    return (
        <div className="text-lg text-primary md:text-xl">
            {!!value ? `${parseFloat(Number(formatUnits(BigInt(value), 18)).toFixed(1)).toLocaleString()}` : '...'}
        </div>
    );
}
