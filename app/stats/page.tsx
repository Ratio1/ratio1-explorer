import { fetchR1Price } from '@/lib/api/blockchain';
import { getTokenSupply } from '@/lib/api/general';
import { routePath } from '@/lib/routes';
import { fN } from '@/lib/utils';
import { TokenSupplyResponse } from '@/typedefs/general';
import { redirect } from 'next/navigation';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

export async function generateMetadata() {
    return {
        title: 'Stats',
        openGraph: {
            title: 'Stats',
        },
    };
}

export default async function StatsPage() {
    let tokenSupply: TokenSupplyResponse;
    let r1Price: bigint;

    const divisor = 10n ** BigInt(18);
    const scale = 1000000n;

    try {
        [tokenSupply, r1Price] = await Promise.all([getTokenSupply(), fetchR1Price()]);
    } catch (error) {
        console.error(error);
        redirect(routePath.notFound);
    }

    return (
        <div className="w-full flex-1">
            <BorderedCard>
                <div className="card-title-big font-bold">$R1 Token</div>

                <div className="col gap-3">
                    <div className="flexible-row">
                        <CardHorizontal
                            label="Circulating Supply"
                            value={fN(tokenSupply.circulatingSupply)}
                            isFlexible
                            widthClasses="min-w-[282px]"
                        />

                        <CardHorizontal
                            label="Total Supply"
                            value={fN(tokenSupply.totalSupply)}
                            isFlexible
                            widthClasses="min-w-[230px]"
                        />
                        <CardHorizontal label="Burned" value={fN(tokenSupply.burned)} isFlexible widthClasses="min-w-[160px]" />
                    </div>

                    <div className="flexible-row">
                        <CardHorizontal
                            label="Max. Theoretical Supply"
                            value={fN(tokenSupply.maxSupply)}
                            isFlexible
                            widthClasses="min-w-[290px]"
                        />

                        <CardHorizontal
                            label="$R1 Price"
                            value={`$${parseFloat((Number((r1Price * scale) / divisor) / Number(scale)).toFixed(2))}`}
                            isFlexible
                            widthClasses="min-w-[150px]"
                        />
                    </div>
                </div>
            </BorderedCard>
        </div>
    );
}
