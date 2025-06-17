import { Config, getNextEpochTimestamp } from '@/config';
import { getServerConfig } from '@/config/serverConfig';
import { getSSURL } from '@/lib/actions';
import { differenceInSeconds } from 'date-fns';
import { cache } from 'react';
import { formatUnits } from 'viem';

const fetchCachedR1MintedLastEpoch = cache(async (config: Config) => {
    const url = await getSSURL(`r1-minted-last-epoch?env=${config.environment}`);

    const res = await fetch(url, {
        next: { revalidate: differenceInSeconds(getNextEpochTimestamp(config), new Date()) + 1 },
    });

    const data: {
        value: string;
    } = await res.json();

    return data.value;
});

export default async function R1MintedLastEpoch() {
    const { config } = await getServerConfig();

    let value: string | undefined;

    try {
        value = await fetchCachedR1MintedLastEpoch(config);
    } catch (error) {
        console.log('Error fetching R1 minted last epoch', error);
        return <div className="text-lg text-slate-600 md:text-xl">—</div>;
    }

    return (
        <div className="text-lg text-primary md:text-xl">
            {!!value ? `${parseFloat(Number(formatUnits(BigInt(value), 18)).toFixed(1)).toLocaleString()}` : '...'}
        </div>
    );
}
