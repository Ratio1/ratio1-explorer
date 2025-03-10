import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import { Suspense } from 'react';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';
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
        ({ nodeAddress, totalAssignedAmount, totalClaimedAmount, assignTimestamp, isBanned, owner } = await getLicense(
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
        <CardBordered useCustomWrapper hasFixedWidth>
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
                    <Item
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
                        <Item
                            label="Owner"
                            value={<CopyableAddress value={owner} size={4} link={`${routePath.owner}/${owner}`} />}
                        />
                    </div>
                )}

                <div className="min-w-[150px]">
                    <Item
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
        </CardBordered>
    );
}
