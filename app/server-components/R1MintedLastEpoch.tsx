import { getSSURL } from '@/lib/actions';
import { cache } from 'react';
import { formatUnits } from 'viem';

const fetchCachedR1MintedLastEpoch = cache(async () => {
    const url = await getSSURL('r1-minted-last-epoch');

    const res = await fetch(url, {
        next: { tags: ['r1-minted-last-epoch'] },
    });

    const data: {
        value: string;
    } = await res.json();
    return data.value;
});

export default async function R1MintedLastEpoch() {
    const value: string = await fetchCachedR1MintedLastEpoch();

    return (
        <div className="text-xl text-primary">
            {R1MintedLastEpoch !== undefined
                ? `${parseFloat(Number(formatUnits(BigInt(value), 18)).toFixed(3)).toLocaleString('en-US')}`
                : '...'}
        </div>
    );
}
