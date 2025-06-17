import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import { Suspense } from 'react';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
import LicenseSmallCard from '../shared/Licenses/LicenseSmallCard';
import { SmallTag } from '../shared/SmallTag';
import NodeSmallCard from './NodeSmallCard';

interface Props {
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
}

export default async function License({ licenseType, licenseId }: Props) {
    let owner: types.EthAddress;
    let nodeAddress: types.EthAddress;
    let totalAssignedAmount: bigint;
    let totalClaimedAmount: bigint;
    let assignTimestamp: bigint;
    let isBanned: boolean;

    try {
        ({ owner, nodeAddress, totalAssignedAmount, totalClaimedAmount, assignTimestamp, isBanned } = await getLicense(
            licenseType,
            licenseId,
        ));
    } catch (error: any) {
        if (!error.message.includes('ERC721: invalid token ID')) {
            console.error({ licenseType, licenseId }, error);
        }
        return null;
    }

    return (
        <BorderedCard useCustomWrapper useFixedWidthLarge>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                {/* License */}
                <LicenseSmallCard
                    licenseId={Number(licenseId)}
                    licenseType={licenseType}
                    totalAssignedAmount={totalAssignedAmount}
                    totalClaimedAmount={totalClaimedAmount}
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
                {!isEmptyETHAddr(owner) && (
                    <div className="flex min-w-[112px]">
                        <CardItem
                            label="Owner"
                            value={
                                <ClientWrapper>
                                    <CopyableAddress value={owner} size={4} link={`${routePath.owner}/${owner}`} />
                                </ClientWrapper>
                            }
                        />
                    </div>
                )}

                <div className="min-w-[150px]">
                    <CardItem
                        label="Assign Timestamp"
                        value={
                            !assignTimestamp ? (
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
                    {!isEmptyETHAddr(nodeAddress) && (
                        <Suspense fallback={<Skeleton className="min-h-[64px] w-[256px] rounded-xl" />}>
                            <NodeSmallCard nodeEthAddr={nodeAddress} />
                        </Suspense>
                    )}
                </div>
            </div>
        </BorderedCard>
    );
}
