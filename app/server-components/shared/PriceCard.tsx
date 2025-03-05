import config from '@/config';
import { fetchR1Price } from '@/lib/api/blockchain';
import Image from 'next/image';
import { CardWithIcon } from './cards/CardWithIcon';
import { RowWithIcon } from './cards/RowWithIcon';

export default async function PriceCard() {
    // TODO: Remove after the liquidity manager is deployed
    if (config.environment === 'mainnet') {
        return null;
    }

    const r1Price = await fetchR1Price();

    if (!r1Price) {
        return null;
    }

    const divisor = 10n ** BigInt(18);
    const scale = 1000000n;
    const r1PriceUsd = Number((r1Price * scale) / divisor) / Number(scale);

    return (
        <>
            <div className="hidden sm:block">
                <CardWithIcon
                    icon={
                        <Image
                            className="h-[22px] w-[22px] min-w-[22px]"
                            src="/token.svg"
                            width={0}
                            height={0}
                            alt="Logo"
                            priority
                        />
                    }
                    label="$R1 Price"
                >
                    {r1PriceUsd ? `$${parseFloat(r1PriceUsd.toFixed(2))}` : '...'}
                </CardWithIcon>
            </div>

            <div className="block sm:hidden">
                <RowWithIcon
                    icon={
                        <Image
                            className="h-[18px] w-[18px] min-w-[18px]"
                            src="/token.svg"
                            width={0}
                            height={0}
                            alt="Logo"
                            priority
                        />
                    }
                    label="$R1 Price"
                >
                    {r1PriceUsd ? `$${parseFloat(r1PriceUsd.toFixed(2))}` : '...'}
                </RowWithIcon>
            </div>
        </>
    );
}
