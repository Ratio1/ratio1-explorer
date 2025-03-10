import { getNextEpochTimestamp } from '@/config';
import { getSSURL } from '@/lib/actions';
import { differenceInSeconds } from 'date-fns';
import { cache } from 'react';
import { formatUnits } from 'viem';

const fetchCachedR1MintedLastEpoch = cache(async () => {
    const url = await getSSURL('r1-minted-last-epoch');

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

    try {
        value = await fetchCachedR1MintedLastEpoch();
    } catch (error) {
        console.error(error);
        return <div className="text-lg md:text-xl">—</div>;
    }

    return (
        <div className="text-lg text-primary md:text-xl">
            {!!value ? `${parseFloat(Number(formatUnits(BigInt(value), 18)).toFixed(1)).toLocaleString()}` : '...'}
        </div>
    );
}
