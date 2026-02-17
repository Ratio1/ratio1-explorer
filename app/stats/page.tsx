import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import AdoptionMetricsLineChart from '@/components/charts/AdoptionMetricsLineChart';
import DailyStatsAreaChart from '@/components/charts/DailyStatsAreaChart';
import NodesMap from '@/components/charts/NodesMap';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { ChartConfig } from '@/components/ui/chart';
import config from '@/config';
import { getLicense } from '@/lib/api/blockchain';
import { getTokenSupply } from '@/lib/api/general';
import { fN } from '@/lib/utils';
import { License } from '@/typedefs/blockchain';
import { TokenSupplyResponse } from '@/typedefs/general';
import Link from 'next/link';
import TreasuryWallets from '../server-components/Licenses/TreasuryWallets';
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

const adoptionChartConfig = {
    overallPercentage: {
        label: 'Total Overall Adoption',
        color: '#F59E0B',
    },
    ndSalesPercentage: {
        label: 'ND Sales',
        color: '#0EA5E9',
    },
    poaiVolumePercentage: {
        label: 'PoAI Volume',
        color: '#22C55E',
    },
} satisfies ChartConfig;

export async function generateMetadata() {
    return {
        title: 'Stats',
        openGraph: {
            title: 'Stats',
        },
        alternates: {
            canonical: '/stats',
        },
    };
}

export default async function StatsPage() {
    let tokenSupply: TokenSupplyResponse;
    let gndLicense: License | undefined;

    try {
        tokenSupply = await getTokenSupply();
    } catch (error) {
        console.error(error);
        return <NotFound />;
    }

    if (config.environment === 'mainnet') {
        try {
            gndLicense = await getLicense('GND', 1);
        } catch (error) {
            console.error(error);
        }
    }

    const getLegendEntries = (config: ChartConfig) =>
        Object.values(config).map((entry, index) => (
            <div className="row gap-1.5" key={index}>
                <div className="h-1 w-3.5 rounded-md" style={{ backgroundColor: entry.color }} />
                <div className="whitespace-nowrap text-sm font-medium text-slate-500">{entry.label}</div>
            </div>
        ));

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

            <BorderedCard>
                <div className="flex flex-col justify-between gap-2 md:gap-3 lg:flex-row">
                    <div className="card-title-big font-bold">PoAI</div>

                    <div className="flex flex-col flex-wrap gap-1 sm:flex-row sm:gap-3 md:items-center larger:gap-5">
                        {getLegendEntries(chartConfig)}
                    </div>
                </div>

                <ClientWrapper>
                    <DailyStatsAreaChart chartConfig={chartConfig} />
                </ClientWrapper>
            </BorderedCard>

            <BorderedCard>
                <div className="flex flex-col justify-between gap-2 md:gap-3 lg:flex-row">
                    <div className="card-title-big font-bold">Adoption</div>

                    <div className="flex flex-col flex-wrap gap-1 sm:flex-row sm:gap-3 md:items-center larger:gap-5">
                        {getLegendEntries(adoptionChartConfig)}
                    </div>
                </div>

                <div className="mb-2 text-xs text-slate-500 md:text-sm">
                    MND owners can claim their allocation based on network adoption.{' '}
                    <Link
                        href="https://ratio1.ai/blog/building-sustainable-token-economics-through-adoption-aware-mining"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary hover:underline"
                    >
                        Read more about this mechanism here
                    </Link>
                    .
                </div>

                <ClientWrapper>
                    <AdoptionMetricsLineChart chartConfig={adoptionChartConfig} />
                </ClientWrapper>
            </BorderedCard>

            {gndLicense && (
                <BorderedCard>
                    <TreasuryWallets license={gndLicense} />
                </BorderedCard>
            )}

            <BorderedCard>
                <div className="card-title-big font-bold">Nodes</div>

                <ClientWrapper>
                    <NodesMap />
                </ClientWrapper>
            </BorderedCard>
        </div>
    );
}

function NotFound() {
    return <ErrorComponent title="Error" description="The stats data could not be loaded. Please try again later." />;
}
