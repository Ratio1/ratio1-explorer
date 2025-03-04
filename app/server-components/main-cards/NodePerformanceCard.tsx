import EpochsChart from '@/components/Nodes/EpochsChart';
import { getCurrentEpoch } from '@/config';
import { arrayAverage } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Tooltip } from '@heroui/tooltip';
import clsx from 'clsx';
import { round } from 'lodash';
import { CardBordered } from '../shared/cards/CardBordered';
import { CardHorizontal } from '../shared/cards/CardHorizontal';

export default async function NodePerformanceCard({
    nodeResponse,
}: {
    nodeResponse: types.OraclesAvailabilityResult & types.OraclesDefaultResult;
}) {
    return (
        <CardBordered>
            <div className="col w-full gap-5 bg-white px-6 py-6">
                <div className="col w-full gap-5">
                    <div className="text-2xl font-bold">Node Performance</div>

                    <div className="col gap-3">
                        <div className="flex flex-wrap items-stretch gap-3">
                            <CardHorizontal
                                label="Last Epoch Availability"
                                value={`${parseFloat(((nodeResponse.epochs_vals[nodeResponse.epochs_vals.length - 1] * 100) / 255).toFixed(2))}%`}
                                isSmall
                                isFlexible
                            />

                            <CardHorizontal
                                label="Last Week Avg. Availability"
                                value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                                isSmall
                                isFlexible
                            />

                            <CardHorizontal
                                label="All Time Avg. Availability"
                                value={`${parseFloat(((arrayAverage(nodeResponse.epochs_vals) / 255) * 100).toFixed(2))}%`}
                                isSmall
                                isFlexible
                            />
                        </div>

                        <div className="flex flex-wrap items-stretch gap-3">
                            <CardHorizontal
                                label="Active Epochs"
                                value={nodeResponse.epochs_vals.filter((value) => value > 0).length}
                                isSmall
                            />

                            <CardHorizontal
                                label="Last 10 Epochs Availability"
                                value={
                                    <div className="row gap-6">
                                        <div className="row gap-1">
                                            {nodeResponse.epochs_vals.slice(-10).map((val, index) => (
                                                <div key={index}>
                                                    <Tooltip
                                                        content={
                                                            <div className="px-1 py-1.5 text-small">
                                                                <div className="font-semibold">
                                                                    {round((val * 100) / 255, 2)}%
                                                                </div>
                                                                <div className="text-slate-500">
                                                                    Epoch {getCurrentEpoch() - 10 + index}
                                                                </div>
                                                            </div>
                                                        }
                                                        closeDelay={0}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                'h-5 w-5 cursor-pointer rounded-md hover:opacity-70',
                                                                {
                                                                    'bg-teal-500': val >= 200,
                                                                    'bg-yellow-500': val >= 100 && val < 200,
                                                                    'bg-red-500': val < 100,
                                                                },
                                                            )}
                                                        ></div>
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="h-[40px] w-[200px]">
                                            <EpochsChart
                                                data={nodeResponse.epochs_vals.slice(-10).map((value, index, array) => ({
                                                    Availability: (100 * value) / 255,
                                                    Epoch: getCurrentEpoch() - array.length + index + 1,
                                                }))}
                                            />
                                        </div>
                                    </div>
                                }
                                isSmall
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CardBordered>
    );
}
