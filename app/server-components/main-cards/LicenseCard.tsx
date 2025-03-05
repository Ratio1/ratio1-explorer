import LicenseRewards from '@/app/server-components/Licenses/LicenseRewards';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { routePath } from '@/lib/routes';
import { getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';
import PoA from '../Licenses/PoA';
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
                'card-title': hasLink,
                'card-title-big': !hasLink,
            })}
        >
            License #{licenseId}
        </div>
    );

    return (
        <CardBordered>
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

            <div className="flexible-row">
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

                {!!license.lastClaimEpoch && (
                    <CardHorizontal label="Last claimed epoch" value={license.lastClaimEpoch.toString()} isSmall />
                )}

                <CardHorizontal
                    label="Usage"
                    value={
                        <div className="w-full min-w-52 xs:min-w-56 md:min-w-60">
                            <LicenseUsageStats
                                totalClaimedAmount={license.totalClaimedAmount}
                                totalAssignedAmount={license.totalAssignedAmount}
                            />
                        </div>
                    }
                    isSmall
                    isFlexible
                />

                <PoA license={license} />

                <Suspense fallback={<Skeleton className="min-h-[76px] w-full rounded-xl md:max-w-[258px]" />}>
                    <LicenseRewards
                        license={license}
                        licenseType={licenseType as 'ND' | 'MND' | 'GND'}
                        getNodeAvailability={getNodeAvailability}
                    />
                </Suspense>
            </div>
        </CardBordered>
    );
}
