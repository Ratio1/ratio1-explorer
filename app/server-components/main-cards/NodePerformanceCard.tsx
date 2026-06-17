import EpochsChart from '@/components/Nodes/EpochsChart';
import { isOraclesSyncing } from '@/lib/oracles';
import { arrayAverage } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Tooltip } from '@heroui/tooltip';
import clsx from 'clsx';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardFlexible } from '../shared/cards/CardFlexible';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import { SmallTag } from '../shared/SmallTag';
import SyncingOraclesTag from '../shared/SyncingOraclesTag';

export default async function NodePerformanceCard({ nodeResponse }: { nodeResponse: types.OraclesAvailabilityResult }) {
    const epochs = nodeResponse.epochs ?? [];
    const epochsVals = nodeResponse.epochs_vals ?? [];

    const hasAvailabilityData = epochs.length > 0 && epochsVals.length > 0 && epochs.length === epochsVals.length;
    const showSyncingTag = isOraclesSyncing(nodeResponse);
    const lastTenEpochs = epochs.slice(-10).map((epoch, index) => ({
        epoch,
        availability: epochsVals.slice(-10)[index],
    }));

    if (showSyncingTag || !hasAvailabilityData) {
        return (
            <BorderedCard>
                <div className="row flex-wrap items-center gap-2.5">
                    <div className="card-title font-bold">Node Performance</div>
                    {showSyncingTag ? <SyncingOraclesTag /> : <SmallTag>No availability data</SmallTag>}
                </div>
            </BorderedCard>
        );
    }

    return (
        <BorderedCard>
            <div className="card-title font-bold">Node Performance</div>

            <div className="flexible-row">
                <CardHorizontal
                    label="Last Epoch Availability"
                    value={`${parseFloat(((epochsVals[epochsVals.length - 1] * 100) / 255).toFixed(2))}%`}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px]"
                />

                <CardHorizontal
                    label="Last Week Avg. Availability"
                    value={`${parseFloat(((arrayAverage(epochsVals.slice(-7)) / 255) * 100).toFixed(2))}%`}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px]"
                />

                <CardHorizontal
                    label="All Time Avg. Availability"
                    value={`${parseFloat(((arrayAverage(epochsVals) / 255) * 100).toFixed(2))}%`}
                    isSmall
                    isFlexible
                    widthClasses="xs:min-w-[316px] min-w-[224px]"
                />

                <CardHorizontal
                    label="Active Epochs"
                    value={epochsVals.filter((value) => value > 0).length}
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
                                    {lastTenEpochs.map(({ epoch, availability }) => {
                                        return (
                                            <div key={epoch}>
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
                                        data={lastTenEpochs.map(({ epoch, availability }) => ({
                                            Availability: (100 * availability) / 255,
                                            Epoch: epoch,
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
                    <CardFlexible>
                        <div className="col w-full gap-4 px-4 py-4 sm:gap-6 md:gap-8 lg:px-6 lg:py-6">
                            <div className="text-[15px] font-medium text-slate-500">Last 10 Epochs Availability</div>

                            <div className="col gap-1.5">
                                {[...lastTenEpochs].reverse().map(({ epoch, availability }) => {
                                    return (
                                        <div key={epoch}>
                                            <div className="row justify-between gap-1.5">
                                                <div className="text-sm font-medium text-slate-500">Epoch {epoch}</div>
                                                <div className="font-semibold">
                                                    {parseFloat(((100 * availability) / 255).toFixed(2))}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardFlexible>
                </div>
            </div>
        </BorderedCard>
    );
}
