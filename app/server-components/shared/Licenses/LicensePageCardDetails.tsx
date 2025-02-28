import { arrayAverage } from '@/lib/utils';
import { License } from '@/typedefs/blockchain';
import clsx from 'clsx';
import { RiTimeLine } from 'react-icons/ri';
import { formatUnits } from 'viem';

const nodePerformanceItems = [
    {
        label: 'Last Epoch',
        classes: 'bg-teal-100 text-teal-600',
    },
    {
        label: 'All time average',
        classes: 'bg-purple-100 text-purple-600',
    },
    {
        label: 'Last week average',
        classes: 'bg-orange-100 text-orange-600',
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

    const getNodePerformanceItem = (key: number, label: string, value: number | undefined, classes: string) => (
        <div key={key} className="row gap-2 sm:gap-3">
            <div className={`rounded-full p-1.5 sm:p-3.5 ${classes}`}>
                <RiTimeLine className="text-2xl" />
            </div>

            <div className="col gap-1 xl:gap-0">
                <div className="text-sm leading-4 text-slate-500 xl:text-base">{label}</div>
                <div className="text-sm font-medium xl:text-base">
                    {value === undefined ? '...' : `${parseFloat(((value / 255) * 100).toFixed(1))}%`}
                </div>
            </div>
        </div>
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
            <div className="col gap-6 lg:gap-8">
                <div className="border-b-2 border-slate-200 pb-6 text-sm lg:pb-8 lg:text-base xl:gap-0">
                    <div className="larger:flex-row flex w-full flex-col gap-6">
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

                    <div className="row gap-4 sm:gap-8">
                        <div className="text-sm text-slate-500 sm:text-base">Uptime per epoch</div>

                        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                            {nodePerformanceItems.map(({ label, classes }, index) =>
                                getNodePerformanceItem(index, label, getNodePerformanceValue(index), classes),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
