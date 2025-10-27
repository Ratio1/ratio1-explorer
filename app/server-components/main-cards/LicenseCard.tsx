import LicenseRewardsPoA from '@/app/server-components/Licenses/LicenseRewardsPoA';
import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import config from '@/config';
import { routePath } from '@/lib/routes';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import Link from 'next/link';
import { Suspense } from 'react';
import { formatUnits } from 'viem';
import PoA from '../Licenses/PoA';
import TreasuryWallets from '../Licenses/TreasuryWallets';
import { CardTitle } from '../shared/CardTitle';
import { LargeTag } from '../shared/LargeTag';
import UsageStats from '../shared/Licenses/UsageStats';

interface Props {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    owner: types.EthAddress;
    getNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
    hasLink?: boolean; // If it has a link to it, it means it's not the main card (displayed on top of the page)
}

export default async function LicenseCard({ license, licenseType, licenseId, owner, getNodeAvailability, hasLink }: Props) {
    const environment = config.environment;

    const getTitle = () => <CardTitle hasLink={hasLink}>License #{licenseId}</CardTitle>;

    return (
        <BorderedCard>
            <div className="row gap-3">
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
                {!!licenseType && (
                    <CardHorizontal
                        label="Type"
                        value={
                            <div
                                className={clsx({
                                    'text-primary': licenseType === 'ND',
                                    'text-purple-600': licenseType === 'MND',
                                    'text-orange-600': licenseType === 'GND',
                                })}
                            >
                                {licenseType}
                            </div>
                        }
                        isSmall
                        isFlexible
                    />
                )}

                {!!owner && (
                    <CardHorizontal
                        label="Owner"
                        value={
                            <ClientWrapper>
                                <CopyableAddress value={owner} size={4} isLarge link={`${routePath.nodeOperator}/${owner}`} />
                            </ClientWrapper>
                        }
                        isSmall
                        isFlexible
                    />
                )}

                {!!license.assignTimestamp && (
                    <CardHorizontal
                        label="Assign timestamp"
                        value={new Date(Number(license.assignTimestamp) * 1000).toLocaleString()}
                        isSmaller
                        isFlexible
                        widthClasses="min-w-[310px] md:min-w-[420px]"
                    />
                )}

                {!!license.lastClaimEpoch && (
                    <CardHorizontal
                        label="Last claimed epoch"
                        value={license.lastClaimEpoch.toString()}
                        isSmall
                        isFlexible
                        widthClasses="min-w-[274px]"
                    />
                )}

                <CardHorizontal
                    label="Usage"
                    value={
                        <div className="w-full min-w-52 xs:min-w-56 md:min-w-60">
                            <UsageStats
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
                    <LicenseRewardsPoA
                        license={license}
                        licenseType={licenseType as 'ND' | 'MND' | 'GND'}
                        getNodeAvailability={getNodeAvailability}
                    />
                </Suspense>

                {licenseType === 'ND' && (
                    <CardHorizontal
                        label="Rewards (PoAI)"
                        value={
                            <div className="text-primary">
                                {!!license.r1PoaiRewards ? '$R1 ' : ''}
                                {license.r1PoaiRewards === undefined
                                    ? '...'
                                    : parseFloat(
                                          Number(formatUnits(license.r1PoaiRewards ?? 0n, 18)).toFixed(3),
                                      ).toLocaleString()}
                            </div>
                        }
                        isSmall
                    />
                )}
            </div>

            {environment === 'mainnet' && licenseId === '1' && licenseType === 'GND' && <TreasuryWallets license={license} />}
        </BorderedCard>
    );
}
