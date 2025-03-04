import LicensePageNode from '@/app/server-components/Licenses/LicensePageNode';
import LicensePageNodePerformance from '@/app/server-components/Licenses/LicensePageNodePerformance';
import LicenseRewards from '@/app/server-components/Licenses/LicenseRewards';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { LicenseUsageStats } from '@/app/server-components/shared/Licenses/LicenseUsageStats';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { getNodeAvailability, getShortAddress, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { RiCpuLine } from 'react-icons/ri';
import { formatUnits } from 'viem';

export async function generateMetadata({ params }) {
    const { licenseId } = await params;

    return {
        title: `License #${licenseId}`,
        openGraph: {
            title: `License #${licenseId}`,
        },
    };
}

export default async function LicensePage({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        notFound();
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        notFound();
    }

    let owner: types.EthAddress, license: types.License;

    try {
        [owner, license] = await Promise.all([getOwnerOfLicense(licenseType, licenseId), getLicense(licenseType, licenseId)]);
    } catch (error) {
        console.error(error);
        notFound();
    }

    const cachedGetNodeAvailability = cache(async () => {
        try {
            const isLinked = !isEmptyETHAddr(license.nodeAddress);

            if (!isLinked) {
                return;
            }

            return await getNodeAvailability(license.nodeAddress, license.assignTimestamp);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <div className="col w-full flex-1 gap-6">
            <CardBordered>
                <div className="col w-full gap-5 bg-white px-6 py-6">
                    <div className="col w-full gap-5">
                        <div className="text-[26px] font-bold">License #{licenseId}</div>

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
                                    <CardHorizontal
                                        label="Last claimed epoch"
                                        value={license.lastClaimEpoch.toString()}
                                        isSmall
                                    />
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
                                                        formatUnits(
                                                            license.totalAssignedAmount - license.totalClaimedAmount,
                                                            18,
                                                        ),
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
                                <Suspense>
                                    <LicenseRewards
                                        license={license}
                                        licenseType={licenseType as 'ND' | 'MND' | 'GND'}
                                        cachedGetNodeAvailability={cachedGetNodeAvailability}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBordered>

            <Suspense>
                <LicensePageNode cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>

            <Suspense>
                <LicensePageNodePerformance cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>
        </div>
    );
}
