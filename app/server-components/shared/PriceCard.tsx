import { fetchR1Price } from '@/lib/api/blockchain';
import Image from 'next/image';
import { CardWithIcon } from './cards/CardWithIcon';

export default async function PriceCard() {
    const r1Price = await fetchR1Price();

    if (!r1Price) {
        return null;
    }

    const divisor = 10n ** BigInt(18);
    const scale = 1000000n;
    const r1PriceUsd = Number((r1Price * scale) / divisor) / Number(scale);

    return (
        <CardWithIcon
            icon={
                <Image className="h-[22px] w-[22px] min-w-[22px]" src="/token.svg" width={0} height={0} alt="Logo" priority />
            }
            label="Current Price"
        >
            <div className="font-semibold leading-none text-primary">
                {r1PriceUsd ? `$${parseFloat(r1PriceUsd.toFixed(2))}` : '...'}
            </div>
        </CardWithIcon>
    );
}
