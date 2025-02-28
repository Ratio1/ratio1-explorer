import { arrayAverage } from '@/lib/utils';
import { License } from '@/typedefs/blockchain';
import clsx from 'clsx';
import { cloneElement } from 'react';
import { formatUnits } from 'viem';
import { CardHorizontal } from '../cards/CardHorizontal';

const nodePerformanceItems = [
    {
        label: 'Last Epoch',
    },
    {
        label: 'Last Week Avg.',
    },
    {
        label: 'All Time Avg.',
    },
];

export const LicensePageCardDetails = ({ license, nodeEpochs }: { license: License; nodeEpochs: number[] }) => {
    const getTitle = (text: string) => <div className="font-medium">{text}</div>;

    const getLine = (label: string, value: string | number, isHighlighted: boolean = false, isAproximate: boolean = false) => (
        <div className="row justify-between gap-3 min-[410px]:justify-start">
            <div className="min-w-[50%] text-slate-500">{label}</div>
            <div
                className={clsx({
                    'font-medium text-primary': isHighlighted,
                })}
            >
                {isAproximate ? '~' : ''}
                {value}
            </div>
        </div>
    );

    const getNodePerformanceItem = (key: number, label: string, value: number | undefined) =>
        cloneElement(
            <CardHorizontal
                label={`${label} Availability`}
                value={value === undefined ? '...' : `${parseFloat(((value / 255) * 100).toFixed(1))}%`}
                isSmall
                isFlexible
                isDarker
            />,
            { key },
        );

    const getNodePerformanceValue = (index: number): number | undefined => {
        switch (index) {
            case 0:
                return nodeEpochs[nodeEpochs.length - 1];

            case 1:
                return arrayAverage(nodeEpochs);

            case 2:
                return arrayAverage(nodeEpochs.slice(-7));

            default:
                return;
        }
    };

    return (
        <div className="px-5 py-5 md:px-8 md:py-7">
            <div className="col gap-6 lg:gap-7">
                <div className="border-b-2 border-slate-200 pb-6 text-sm lg:pb-7 lg:text-base xl:gap-0">
                    <div className="flex w-full flex-col gap-6 larger:flex-row">
                        <div className="col flex-1 gap-3">
                            {getTitle('Details')}

                            {getLine(
                                'Assign timestamp',
                                license.assignTimestamp === 0n
                                    ? 'N/A'
                                    : new Date(Number(license.assignTimestamp) * 1000).toLocaleString(),
                            )}
                            {getLine(
                                'Last claimed epoch',
                                license.lastClaimEpoch === 0n ? 'N/A' : Number(license.lastClaimEpoch),
                            )}

                            <div className="mt-3">{getTitle('Proof of Availability')}</div>

                            {getLine(
                                'Initial amount',
                                parseFloat(
                                    Number(formatUnits(license.totalAssignedAmount ?? 0n, 18)).toFixed(2),
                                ).toLocaleString(),
                            )}
                            {getLine(
                                'Remaining amount',
                                parseFloat(
                                    Number(formatUnits(license.totalAssignedAmount - license.totalClaimedAmount, 18)).toFixed(
                                        2,
                                    ),
                                ).toLocaleString(),
                            )}
                        </div>

                        <div className="col flex-1 gap-3"></div>
                    </div>
                </div>

                <div className="col -mt-0.5 gap-3">
                    {getTitle('Node performance')}

                    <div className="flex flex-wrap items-stretch gap-3">
                        {nodePerformanceItems.map(({ label }, index) =>
                            getNodePerformanceItem(index, label, getNodePerformanceValue(index)),
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
