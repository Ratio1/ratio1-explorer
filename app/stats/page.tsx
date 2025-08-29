import CustomAreaChart from '@/components/charts/CustomAreaChart';
import ClientWrapper from '@/components/shared/ClientWrapper';
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
        <div className="col w-full flex-1 gap-4 md:gap-6">
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

            <div className="grid grid-cols-2 gap-4 md:gap-6">
                <BorderedCard>
                    <div className="col">
                        <div className="text-xl font-bold">$USDC Locked</div>

                        <div className="text-sm font-medium text-slate-500">
                            Total daily $USDC locked in all the CSP smart contracts
                        </div>
                    </div>

                    <ClientWrapper>
                        <CustomAreaChart
                            label="$USDC"
                            data={tokenStats.data.map((entry) => ({
                                date: new Date(entry.creationTimestamp),
                                value: entry.dailyUsdcLocked,
                            }))}
                            valueType="usdc"
                        />
                    </ClientWrapper>
                </BorderedCard>

                <BorderedCard>
                    <div className="col">
                        <div className="text-xl font-bold">Active Jobs</div>

                        <div className="text-sm font-medium text-slate-500">Daily total number of active jobs</div>
                    </div>

                    <ClientWrapper>
                        <CustomAreaChart
                            label="Active Jobs"
                            data={tokenStats.data.map((entry) => ({
                                date: new Date(entry.creationTimestamp),
                                value: entry.dailyActiveJobs,
                            }))}
                            valueType="number"
                        />
                    </ClientWrapper>
                </BorderedCard>
            </div>
        </div>
    );
}
