import LicenseRewards from '@/app/server-components/Licenses/LicenseRewards';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { routePath } from '@/lib/routes';
import { getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';
import { RiCpuLine } from 'react-icons/ri';
import { formatUnits } from 'viem';
import { LargeTag } from '../shared/LargeTag';
import LicenseUsageStats from '../shared/Licenses/LicenseUsageStats';

interface Props {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    owner: types.EthAddress;
    getNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
    hasLink?: boolean; // If it has a link to it, it means it's not the main card (displayed on top of the page)
}

export default async function LicenseCard({ license, licenseType, licenseId, owner, getNodeAvailability, hasLink }: Props) {
    const getTitle = () => (
        <div
            className={clsx('font-bold', {
                'text-2xl': hasLink,
                'text-[26px]': !hasLink,
            })}
        >
            License #{licenseId}
        </div>
    );

    return (
        <CardBordered>
            <div className="col w-full gap-5 bg-white px-6 py-6">
                <div className="col w-full gap-5">
                    <div className="row gap-2.5">
                        {!hasLink ? (
                            getTitle()
                        ) : (
                            <Link href={`${routePath.license}/${licenseType}/${licenseId}`} className="hover:text-primary">
                                {getTitle()}
                            </Link>
                        )}

                        {license.isBanned && <LargeTag variant="banned">Banned</LargeTag>}
                    </div>

                    <div className="col gap-3">
                        {/* Row 1 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            {!!licenseType && <CardHorizontal label="Type" value={licenseType} isSmall />}

                            {!!owner && (
                                <CardHorizontal
                                    label="Owner"
                                    value={
                                        <Link href={`${routePath.owner}/${owner}`}>
                                            <div className="hover:opacity-50">{getShortAddress(owner)}</div>
                                        </Link>
                                    }
                                    isSmall
                                />
                            )}

                            {!!license.assignTimestamp && (
                                <CardHorizontal
                                    label="Assign timestamp"
                                    value={new Date(Number(license.assignTimestamp) * 1000).toLocaleString()}
                                    isSmall
                                    isFlexible
                                />
                            )}
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            {!!license.lastClaimEpoch && (
                                <CardHorizontal label="Last claimed epoch" value={license.lastClaimEpoch.toString()} isSmall />
                            )}

                            <CardHorizontal
                                label="Usage"
                                value={
                                    <div className="w-full min-w-60">
                                        <LicenseUsageStats
                                            totalClaimedAmount={license.totalClaimedAmount}
                                            totalAssignedAmount={license.totalAssignedAmount}
                                        />
                                    </div>
                                }
                                isSmall
                            />

                            <CardFlexible isFlexible>
                                <div className="row h-[76px] w-full justify-between gap-16 px-6 py-2">
                                    <div className="row gap-2">
                                        <div className="center-all rounded-full bg-blue-100 p-2.5 text-2xl text-primary">
                                            <RiCpuLine />
                                        </div>

                                        <div className="text-[15px] font-medium leading-none text-slate-500">PoA</div>
                                    </div>

                                    <div className="col gap-[5px]">
                                        <div className="text-[15px] font-medium leading-none text-slate-500">Remaining</div>
                                        <div className="font-semibold leading-none">
                                            {parseFloat(
                                                Number(
                                                    formatUnits(license.totalAssignedAmount - license.totalClaimedAmount, 18),
                                                ).toFixed(2),
                                            ).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="col gap-[5px]">
                                        <div className="text-[15px] font-medium leading-none text-slate-500">
                                            Initial amount
                                        </div>
                                        <div className="font-semibold leading-none">
                                            {parseFloat(
                                                Number(formatUnits(license.totalAssignedAmount ?? 0n, 18)).toFixed(2),
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </CardFlexible>
                        </div>

                        {/* Row 3 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            <Suspense fallback={<Skeleton className="min-h-[76px] w-full max-w-[258px] rounded-xl" />}>
                                <LicenseRewards
                                    license={license}
                                    licenseType={licenseType as 'ND' | 'MND' | 'GND'}
                                    getNodeAvailability={getNodeAvailability}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </CardBordered>
    );
}
