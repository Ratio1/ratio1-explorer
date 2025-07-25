import EpochsChart from '@/components/Nodes/EpochsChart';
import { getCurrentEpoch } from '@/config';
import { arrayAverage } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Tooltip } from '@heroui/tooltip';
import clsx from 'clsx';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardHorizontal } from '../shared/cards/CardHorizontal';

export default async function NodePerformanceCard({
    nodeResponse,
}: {
    nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
}) {
    return (
        <BorderedCard>
            <div className="card-title font-bold">Node Performance</div>

            <div className="flexible-row">
                <CardHorizontal
                    label="Last Epoch Availability"
                    value={`${parseFloat(((nodeResponse.epochs_vals[nodeResponse.epochs_vals.length - 1] * 100) / 255).toFixed(2))}%`}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px]"
                />

                <CardHorizontal
                    label="Last Week Avg. Availability"
                    value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px]"
                />

                <CardHorizontal
                    label="All Time Avg. Availability"
                    value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals) / 255) * 100).toFixed(2))}%`}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px] min-w-[224px]"
                />

                <CardHorizontal
                    label="Active Epochs"
                    value={nodeResponse.epochs_vals.filter((value) => value > 0).length}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px] min-w-[224px]"
                />

                <div className="web-only-block">
                    <CardHorizontal
                        label="Last 10 Epochs Availability"
                        value={
                            <div className="row gap-6">
                                <div className="row gap-1">
                                    {nodeResponse.epochs.slice(-10).map((epoch, index) => {
                                        const availability = nodeResponse.epochs_vals.slice(-10)[index];

                                        return (
                                            <div key={index}>
                                                <Tooltip
                                                    content={
                                                        <div className="px-1 py-1.5 text-small">
                                                            <div className="font-semibold">
                                                                {parseFloat(((availability * 100) / 255).toFixed(2))}%
                                                            </div>
                                                            <div className="text-slate-500">Epoch {epoch}</div>
                                                        </div>
                                                    }
                                                    closeDelay={0}
                                                >
                                                    <div
                                                        className={clsx('h-5 w-5 cursor-pointer rounded-md hover:opacity-70', {
                                                            'bg-teal-500': availability >= 200,
                                                            'bg-yellow-500': availability >= 100 && availability < 200,
                                                            'bg-red-500': availability < 100,
                                                        })}
                                                    ></div>
                                                </Tooltip>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="h-[40px] w-[200px]">
                                    <EpochsChart
                                        data={nodeResponse.epochs_vals.slice(-10).map((value, index, array) => ({
                                            Availability: (100 * value) / 255,
                                            Epoch: nodeResponse.epochs[index],
                                        }))}
                                    />
                                </div>
                            </div>
                        }
                        isSmall
                        isFlexible
                    />
                </div>

                <div className="mobile-only-block w-full">
                    <CardHorizontal
                        label="Last 5 Epochs Availability"
                        value={
                            <div className="row gap-1">
                                {nodeResponse.epochs_vals.slice(-5).map((val, index) => (
                                    <div key={index}>
                                        <Tooltip
                                            content={
                                                <div className="px-1 py-1.5 text-small">
                                                    <div className="font-semibold">
                                                        {parseFloat(((val * 100) / 255).toFixed(2))}%
                                                    </div>
                                                    <div className="text-slate-500">Epoch {getCurrentEpoch() - 10 + index}</div>
                                                </div>
                                            }
                                            closeDelay={0}
                                        >
                                            <div
                                                className={clsx('h-5 w-5 cursor-pointer rounded-md hover:opacity-70', {
                                                    'bg-teal-500': val >= 200,
                                                    'bg-yellow-500': val >= 100 && val < 200,
                                                    'bg-red-500': val < 100,
                                                })}
                                            ></div>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                        }
                        isSmall
                        isFlexible
                    />
                </div>
            </div>
        </BorderedCard>
    );
}
