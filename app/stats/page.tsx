import DailyStatsAreaChart from '@/components/charts/DailyStatsAreaChart';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { ChartConfig } from '@/components/ui/chart';
import { getTokenStats, getTokenSupply } from '@/lib/api/general';
import { routePath } from '@/lib/routes';
import { fN } from '@/lib/utils';
import { TokenStatsResponse, TokenSupplyResponse } from '@/typedefs/general';
import { redirect } from 'next/navigation';
import { BorderedCard } from '../server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '../server-components/shared/cards/CardHorizontal';

const chartConfig = {
    usdcLocked: {
        label: 'Escrow TVL ($USDC)',
        color: '#0074D9',
    },
    activeJobs: {
        label: 'Total Active Jobs',
        color: '#FFDC00',
    },
    poaiRewards: {
        label: 'Daily PoAI Rewards ($USDC)',
        color: '#2ECC40',
    },
    tokenBurned: {
        label: 'Daily PoAI Burn ($R1)',
        color: '#FF4136',
    },
} satisfies ChartConfig;

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
        // console.log('[StatsPage] Token Stats', tokenStats);
    } catch (error) {
        console.error(error);
        redirect(routePath.notFound);
    }

    const getLegendEntries = () =>
        Object.values(chartConfig).map((entry, index) => (
            <div className="row gap-1.5" key={index}>
                <div className="h-1 w-3.5 rounded-md" style={{ backgroundColor: entry.color }} />
                <div className="whitespace-nowrap text-sm font-medium text-slate-500">{entry.label}</div>
            </div>
        ));

    return (
        <div className="col w-full flex-1 gap-4 md:gap-6">
            <BorderedCard>
                <div className="card-title-big font-bold">$R1 Stats</div>

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

            <BorderedCard>
                <div className="flex flex-col justify-between gap-2 md:gap-3 lg:flex-row">
                    <div className="card-title-big font-bold">Daily PoAI Stats</div>

                    <div className="larger:gap-5 flex flex-col flex-wrap gap-1 sm:flex-row sm:gap-3 md:items-center">
                        {getLegendEntries()}
                    </div>
                </div>

                <ClientWrapper>
                    <DailyStatsAreaChart data={tokenStats.data} chartConfig={chartConfig} />
                </ClientWrapper>
            </BorderedCard>
        </div>
    );
}
