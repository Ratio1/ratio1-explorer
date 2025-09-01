'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { fBI } from '@/lib/utils';
import { TokenStatsEntry } from '@/typedefs/general';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

type BaseChartEntry = {
    label: string;
    value: number;
    normalizedValue: number;
};

type BigIntChartEntry = BaseChartEntry & {
    type: 'bigint';
    decimals: number;
};

type NumberChartEntry = BaseChartEntry & {
    type: 'number';
};

type ChartEntry = BigIntChartEntry | NumberChartEntry;

export default function DailyStatsAreaChart({ data, chartConfig }: { data: TokenStatsEntry[]; chartConfig: ChartConfig }) {
    const chartData = data.map((entry) => ({
        date: new Date(entry.creationTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        usdcLocked: {
            type: 'bigint',
            label: chartConfig.usdcLocked.label,
            value: entry.dailyUsdcLocked,
            decimals: 6,
            normalizedValue: Number(BigInt(entry.dailyUsdcLocked) / BigInt(10 ** 6)),
        },
        activeJobs: {
            type: 'number',
            label: chartConfig.activeJobs.label,
            value: entry.dailyActiveJobs,
            normalizedValue: entry.dailyActiveJobs * 75,
        },
        poaiRewards: {
            type: 'bigint',
            label: chartConfig.poaiRewards.label,
            value: entry.dailyPOAIRewards,
            decimals: 6,
            normalizedValue: Number(BigInt(entry.dailyPOAIRewards) / BigInt(10 ** 6)) * 20,
        },
        tokenBurned: {
            type: 'bigint',
            label: chartConfig.tokenBurned.label,
            value: entry.totalTokenBurn - entry.totalNdContractTokenBurn,
            decimals: 18,
            normalizedValue:
                Number((BigInt(entry.totalTokenBurn) - BigInt(entry.totalNdContractTokenBurn)) / BigInt(10 ** 18)) * 20,
        },
    }));

    const formatValue = (entry: ChartEntry) => {
        if (entry.type === 'number') {
            return entry.value;
        } else {
            return fBI(BigInt(entry.value), entry.decimals, 2);
        }
    };

    return (
        <div className="col -mx-[5px] gap-0.5">
            <ChartContainer className="aspect-auto h-[240px] w-full" config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 5,
                        right: 5,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid vertical={false} />

                    {/* Hidden, only used to provide the date to the tooltip */}
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} hide />

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                formatter={(_value, name, _item, _index, payload) => {
                                    const key = (name as string).split('.')[0];
                                    const entry = payload[key] as ChartEntry;

                                    return (
                                        <div className="row w-full justify-between gap-4">
                                            <div className="row gap-1.5">
                                                <div
                                                    className="h-2 w-2 rounded-sm"
                                                    style={{ backgroundColor: chartConfig[key].color }}
                                                />
                                                <div className="font-normal text-slate-600">{entry.label}</div>
                                            </div>

                                            <div className="font-robotoMono font-medium">{formatValue(entry)}</div>
                                        </div>
                                    );
                                }}
                            />
                        }
                    />

                    <defs>
                        <linearGradient id="fillUsdcLocked" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-usdcLocked)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-usdcLocked)" stopOpacity={0.1} />
                        </linearGradient>

                        <linearGradient id="fillActiveJobs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-activeJobs)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-activeJobs)" stopOpacity={0.1} />
                        </linearGradient>

                        <linearGradient id="fillPoaiRewards" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-poaiRewards)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-poaiRewards)" stopOpacity={0.1} />
                        </linearGradient>

                        <linearGradient id="fillTokenBurned" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-tokenBurned)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-tokenBurned)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <Area
                        dataKey="usdcLocked.normalizedValue"
                        type="linear"
                        fill="url(#fillUsdcLocked)"
                        fillOpacity={0.4}
                        stroke="var(--color-usdcLocked)"
                        stackId="a"
                    />

                    <Area
                        dataKey="activeJobs.normalizedValue"
                        type="linear"
                        fill="url(#fillActiveJobs)"
                        fillOpacity={0.4}
                        stroke="var(--color-activeJobs)"
                        stackId="b"
                    />

                    <Area
                        dataKey="poaiRewards.normalizedValue"
                        type="linear"
                        fill="url(#fillPoaiRewards)"
                        fillOpacity={0.4}
                        stroke="var(--color-poaiRewards)"
                        stackId="c"
                    />

                    <Area
                        dataKey="tokenBurned.normalizedValue"
                        type="linear"
                        fill="url(#fillTokenBurned)"
                        fillOpacity={0.4}
                        stroke="var(--color-tokenBurned)"
                        stackId="d"
                    />
                </AreaChart>
            </ChartContainer>

            <ChartContainer className="mx-[5px] -mb-1 h-6" config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 20,
                        right: 20,
                    }}
                >
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}
