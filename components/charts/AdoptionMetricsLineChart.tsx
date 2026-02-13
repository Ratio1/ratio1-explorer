'use client';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AdoptionMetricsEntry, getAdoptionMetricsRange } from '@/lib/api/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const compactNumberFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
});

const isAdoptionMetricsEntry = (value: unknown): value is AdoptionMetricsEntry => {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<AdoptionMetricsEntry>;
    return (
        typeof candidate.epoch === 'number' &&
        typeof candidate.dateLabel === 'string' &&
        typeof candidate.ndSalesPercentage === 'number' &&
        typeof candidate.poaiVolumePercentage === 'number' &&
        typeof candidate.overallPercentage === 'number' &&
        typeof candidate.licensesSold === 'number' &&
        typeof candidate.poaiVolumeUsdc === 'number'
    );
};

export default function AdoptionMetricsLineChart({ chartConfig }: { chartConfig: ChartConfig }) {
    const [data, setData] = useState<AdoptionMetricsEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await getAdoptionMetricsRange();
                setData(response);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return <Skeleton className="h-[260px] w-full rounded-xl" />;
    }

    if (!data.length) {
        return <div className="row h-[260px] justify-center text-sm text-slate-500">No adoption metrics available yet.</div>;
    }

    const maxPercentage = Math.max(
        ...data.map((entry) => Math.max(entry.ndSalesPercentage, entry.poaiVolumePercentage, entry.overallPercentage)),
    );
    const yAxisMax = Math.min(100, Math.max(1, Math.ceil(maxPercentage * 5)));
    const formatPercentageTick = (value: number) => {
        if (value < 1) return `${value.toFixed(2)}%`;
        if (value < 10) return `${value.toFixed(1)}%`;
        return `${value.toFixed(0)}%`;
    };

    return (
        <ChartContainer className="aspect-auto h-[260px] w-full" config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 5,
                    right: 12,
                    top: 6,
                    bottom: 6,
                }}
            >
                <CartesianGrid vertical={false} />

                <XAxis dataKey="dateLabel" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />

                <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    domain={[0, yAxisMax]}
                    tickFormatter={(value) => formatPercentageTick(Number(value))}
                />

                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(_value, payload) => {
                                const candidate = payload?.[0]?.payload;
                                const entry = isAdoptionMetricsEntry(candidate) ? candidate : undefined;
                                return entry ? `${entry.dateLabel} (Epoch ${entry.epoch})` : '';
                            }}
                            formatter={(value, name, item) => {
                                const key = name as keyof typeof chartConfig;
                                const percentage = Number(value);
                                const point = isAdoptionMetricsEntry(item?.payload) ? item.payload : undefined;
                                let rightValue = `${percentage.toFixed(2)}%`;

                                if (key === 'ndSalesPercentage' && point) {
                                    rightValue = `${compactNumberFormatter.format(point.licensesSold)} • ${rightValue}`;
                                }

                                if (key === 'poaiVolumePercentage' && point) {
                                    rightValue = `${compactCurrencyFormatter.format(point.poaiVolumeUsdc)} • ${rightValue}`;
                                }

                                return (
                                    <div className="row w-full justify-between gap-4">
                                        <div className="row gap-1.5">
                                            <div
                                                className="h-2 w-2 rounded-sm"
                                                style={{ backgroundColor: chartConfig[key]?.color }}
                                            />
                                            <div className="font-normal text-slate-600">{chartConfig[key]?.label ?? name}</div>
                                        </div>

                                        <div className="font-robotoMono font-medium">{rightValue}</div>
                                    </div>
                                );
                            }}
                        />
                    }
                />

                <Line
                    type="monotone"
                    dataKey="ndSalesPercentage"
                    stroke="var(--color-ndSalesPercentage)"
                    strokeWidth={1.75}
                    strokeDasharray="6 5"
                    strokeOpacity={0.55}
                    dot={false}
                    activeDot={{ r: 2.5 }}
                />
                <Line
                    type="monotone"
                    dataKey="poaiVolumePercentage"
                    stroke="var(--color-poaiVolumePercentage)"
                    strokeWidth={1.75}
                    strokeDasharray="6 5"
                    strokeOpacity={0.55}
                    dot={false}
                    activeDot={{ r: 2.5 }}
                />
                <Line
                    type="monotone"
                    dataKey="overallPercentage"
                    stroke="var(--color-overallPercentage)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                        r: 4,
                        stroke: 'var(--color-overallPercentage)',
                        strokeWidth: 1.5,
                        fill: '#ffffff',
                    }}
                />
            </LineChart>
        </ChartContainer>
    );
}
