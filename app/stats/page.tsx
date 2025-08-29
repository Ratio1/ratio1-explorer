import { getTokenStats, getTokenSupply } from '@/lib/api/general';
import { routePath } from '@/lib/routes';
import { fN } from '@/lib/utils';
import { TokenStatsResponse, TokenSupplyResponse } from '@/typedefs/general';
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
    let tokenStats: TokenStatsResponse;

    try {
        [tokenSupply, tokenStats] = await Promise.all([getTokenSupply(), getTokenStats()]);
        console.log('[StatsPage] Token Supply', tokenSupply);
        console.log('[StatsPage] Token Stats', tokenStats);
    } catch (error) {
        console.error(error);
        redirect(routePath.notFound);
    }

    return (
        <div className="w-full flex-1">
            <BorderedCard>
                <div className="card-title-big font-bold">Token</div>

                <div className="col gap-3">
                    <div className="flexible-row">
                        <CardHorizontal
                            label="Circulating Supply"
                            value={fN(tokenSupply.circulatingSupply)}
                            isFlexible
                            widthClasses="min-w-[292px]"
                        />

                        <CardHorizontal
                            label="Total Supply"
                            value={fN(tokenSupply.totalSupply)}
                            isFlexible
                            widthClasses="min-w-[230px]"
                        />
                        <CardHorizontal
                            label="Max. Theoretical Supply"
                            value={fN(tokenSupply.maxSupply)}
                            isFlexible
                            widthClasses="min-w-[320px]"
                        />

                        <CardHorizontal label="Burned" value={fN(tokenSupply.burned)} isFlexible widthClasses="min-w-[140px]" />
                    </div>
                </div>
            </BorderedCard>
        </div>
    );
}
