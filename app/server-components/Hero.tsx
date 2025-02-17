import { HeroEpochTimer } from '@/components/HeroEpochTimer';
import { cachedGetActiveNodes } from '@/lib/api';
import { getNodes } from '@/lib/api/oracles';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import { sum, sumBy } from 'lodash';
import { notFound } from 'next/navigation';
import { FunctionComponent, JSX, PropsWithChildren } from 'react';
import { RiTimeLine } from 'react-icons/ri';
import { BorderedCard } from './shared/BorderedCard';

export default async function Hero() {
    let nodesResponse: types.OraclesDefaultResult;
    let activeNodesResponse: types.OraclesDefaultResult;

    try {
        nodesResponse = await getNodes();
        console.log('[Hero.tsx] Nodes List', nodesResponse);

        activeNodesResponse = await cachedGetActiveNodes();
        console.log('[Hero.tsx] Active Nodes', activeNodesResponse);
    } catch (error) {
        notFound();
    }

    const last7EpochAvailabilities: number[][] = Object.values(activeNodesResponse.result.nodes)
        .slice(1)
        .map((node) => {
            let result: {
                [key: string]: number;
            } = {};
            const str: string = node.recent_history.last_10_ep;

            try {
                const jsonString = str.replace(/(\d+):/g, '"$1":');
                result = JSON.parse(jsonString);
            } catch (error) {
                console.error('Error parsing string into JSON', str);
            }

            return Object.values(result).slice(-7);
        });

    const getLastEpochAvgAvailability = () =>
        sumBy(last7EpochAvailabilities, (avail) => avail[avail.length - 1]) / last7EpochAvailabilities.length;

    const getLast7EpochsAvgAvailability = () =>
        sumBy(last7EpochAvailabilities, (avail) => sum(avail) / avail.length) / last7EpochAvailabilities.length;

    // console.log('[Hero.tsx] Availabilities', last7EpochAvailabilities);

    return (
        <div className="w-full">
            <BorderedCard>
                <div className="w-full bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">Nodes</div>

                        <div className="col gap-3">
                            <div className="row flex-wrap gap-3">
                                <CardHorizontal
                                    label="Nodes"
                                    value={Object.keys(nodesResponse.result.nodes).length - 1}
                                    hasFlex
                                />

                                <CardHorizontal
                                    label="Active Nodes"
                                    value={Object.keys(activeNodesResponse.result.nodes).length - 1}
                                    hasFlex
                                />

                                <CardHorizontal
                                    label="% of Active Nodes"
                                    value={`${parseFloat(
                                        (
                                            (100 * (Object.keys(activeNodesResponse.result.nodes).length - 1)) /
                                            (Object.keys(nodesResponse.result.nodes).length - 1)
                                        ).toFixed(1),
                                    )}
                                        %`}
                                />

                                <CardHorizontal
                                    label="Last Epoch Avg. Availability"
                                    value={`${parseFloat(((getLastEpochAvgAvailability() / 255) * 100).toFixed(1))}%`}
                                />
                            </div>

                            <div className="row flex-wrap gap-3">
                                <CardHorizontal
                                    label="Last 7 Epochs Avg. Availability"
                                    value={`${parseFloat(((getLast7EpochsAvgAvailability() / 255) * 100).toFixed(1))}%`}
                                />

                                <CardHorizontal
                                    label={
                                        <div className="row gap-1.5">
                                            <RiTimeLine className="text-lg" />
                                            <div>Epoch {nodesResponse.result.server_current_epoch} ends in</div>
                                        </div>
                                    }
                                    value={<HeroEpochTimer />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BorderedCard>
        </div>
    );
}

const CardHorizontal = ({
    label,
    value,
    hasFlex,
}: {
    label: string | JSX.Element;
    value: number | string | JSX.Element;
    hasFlex?: boolean;
}) => {
    return (
        <Card hasFlex={hasFlex}>
            <div className="row justify-between gap-12 px-6 py-6">
                <div className="text-[15px] font-medium text-slate-500">{label}</div>
                <div className="text-2xl font-semibold">{value}</div>
            </div>
        </Card>
    );
};

const Card: FunctionComponent<PropsWithChildren<{ hasFlex?: boolean }>> = ({ children, hasFlex }) => {
    return (
        <div
            className={clsx('min-w-48 rounded-xl bg-slate-100', {
                'flex-1': hasFlex,
            })}
        >
            {children}
        </div>
    );
};
