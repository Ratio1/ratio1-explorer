'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { fBI } from '@/lib/utils';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

export default function CustomAreaChart({
    label,
    data,
    valueType,
}: {
    label: string;
    data: { date: Date; value: number }[];
    valueType: 'number' | 'r1' | 'usdc';
}) {
    const chartConfig = {
        primary: {
            label,
            color: '#1b47f7',
        },
    } satisfies ChartConfig;

    const chartData = data.map((entry) => ({
        date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        [label]: entry.value,
    }));

    const formatValue = (value: number) => {
        if (valueType === 'number') {
            return value;
        } else {
            const decimals = valueType === 'r1' ? 18 : 6;
            return fBI(BigInt(value), decimals, 2);
        }
    };

    return (
        <div className="col gap-1">
            <ChartContainer className="aspect-auto h-[200px] w-full" config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 0,
                        right: 0,
                    }}
                >
                    <CartesianGrid vertical={false} />

                    {/* <YAxis
                        dataKey={label}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value: number) => formatValue(value).toString()}
                    /> */}

                    {/* <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} /> */}

                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                formatter={(value) => {
                                    if (typeof value === 'number') {
                                        const formattedValue = formatValue(value);
                                        return (
                                            <div className="row w-full justify-between gap-1.5">
                                                <div className="text-slate-500">{label}</div>
                                                <div className="font-robotoMono">{formattedValue}</div>
                                            </div>
                                        );
                                    }

                                    return value;
                                }}
                            />
                        }
                    />

                    <defs>
                        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <Area
                        dataKey={label}
                        type="natural"
                        fill="url(#fill)"
                        fillOpacity={0.4}
                        stroke="var(--color-primary)"
                        stackId="a"
                    />
                </AreaChart>
            </ChartContainer>

            <ChartContainer className="-mb-1 h-6" config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 24,
                        right: 24,
                    }}
                >
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={8} />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}
