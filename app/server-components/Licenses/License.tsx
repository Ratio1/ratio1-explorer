import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import clsx from 'clsx';
import { Suspense } from 'react';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';
import LicenseSmallCard from '../shared/Licenses/LicenseSmallCard';
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
        [owner, { nodeAddress, totalAssignedAmount, totalClaimedAmount, assignTimestamp, isBanned }] = await Promise.all([
            getOwnerOfLicense(licenseType, licenseId),
            getLicense(licenseType, licenseId),
        ]);
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

                {/* Owner */}
                {!isEmptyETHAddr(owner) && (
                    <Item
                        label="Owner"
                        value={<CopyableAddress value={owner} size={4} link={`${routePath.owner}/${owner}`} />}
                    />
                )}

                <div className="min-w-[150px]">
                    <Item
                        label="Assign Timestamp"
                        value={
                            !assignTimestamp ? (
                                <div>Not assigned</div>
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
