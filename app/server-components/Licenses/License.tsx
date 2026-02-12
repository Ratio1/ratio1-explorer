import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import { isZeroAddress } from '@/lib/utils';
import { LicenseListItem } from '@/typedefs/general';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import { Suspense } from 'react';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
import LicenseSmallCard from '../shared/Licenses/LicenseSmallCard';
import { SmallTag } from '../shared/SmallTag';
import NodeSmallCard from './NodeSmallCard';

interface Props {
    license: LicenseListItem;
}

export default function License({ license }: Props) {
    const { licenseType, licenseId, owner, nodeAddress, totalAssignedAmount, totalClaimedAmount, assignTimestamp, isBanned } =
        license;

    return (
        <BorderedCard useCustomWrapper useFixedWidthLarge>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                {/* License */}
                <LicenseSmallCard
                    licenseId={licenseId}
                    licenseType={licenseType}
                    totalAssignedAmount={BigInt(totalAssignedAmount)}
                    totalClaimedAmount={BigInt(totalClaimedAmount)}
                    isBanned={isBanned}
                    isLink
                    hideType
                />

                <div className="flex min-w-[34px]">
                    <CardItem
                        label="License Type"
                        value={
                            <div
                                className={clsx('font-medium', {
                                    'text-primary': licenseType === 'ND',
                                    'text-purple-600': licenseType === 'MND',
                                    'text-orange-600': licenseType === 'GND',
                                })}
                            >
                                {licenseType}
                            </div>
                        }
                    />
                </div>

                {/* Owner */}
                {!isZeroAddress(owner) && (
                    <div className="flex min-w-[112px]">
                        <CardItem
                            label="Owner"
                            value={
                                <ClientWrapper>
                                    <CopyableAddress value={owner} size={4} link={`${routePath.account}/${owner}`} />
                                </ClientWrapper>
                            }
                        />
                    </div>
                )}

                <div className="min-w-[150px]">
                    <CardItem
                        label="Assign Timestamp"
                        value={
                            !assignTimestamp || assignTimestamp === '0' ? (
                                <>
                                    <div className="block lg:hidden">
                                        <div className="text-slate-400">Not assigned</div>
                                    </div>

                                    <div className="hidden lg:block">
                                        <SmallTag>Not assigned</SmallTag>
                                    </div>
                                </>
                            ) : (
                                <>{new Date(Number(assignTimestamp) * 1000).toLocaleString()}</>
                            )
                        }
                    />
                </div>

                {/* Node */}
                <div className="flex min-w-[256px] justify-end">
                    {!isZeroAddress(nodeAddress) && (
                        <Suspense fallback={<Skeleton className="min-h-[64px] w-[256px] rounded-xl" />}>
                            <NodeSmallCard nodeEthAddr={nodeAddress} />
                        </Suspense>
                    )}
                </div>
            </div>
        </BorderedCard>
    );
}
