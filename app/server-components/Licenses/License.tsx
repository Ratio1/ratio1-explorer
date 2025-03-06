import { SmallCard } from '@/app/server-components/shared/Licenses/SmallCard';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import clsx from 'clsx';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';
import LicenseSmallCard from '../shared/Licenses/LicenseSmallCard';

interface Props {
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
}

export default async function License({ licenseType, licenseId }: Props) {
    let owner: types.EthAddress;
    let nodeAddress: types.EthAddress;
    let totalAssignedAmount: bigint;
    let totalClaimedAmount: bigint;
    let lastClaimEpoch: bigint;
    let assignTimestamp: bigint;
    let lastClaimOracle: types.EthAddress;
    let isBanned: boolean;

    try {
        [
            owner,
            {
                nodeAddress,
                totalAssignedAmount,
                totalClaimedAmount,
                lastClaimEpoch,
                assignTimestamp,
                lastClaimOracle,
                isBanned,
            },
        ] = await Promise.all([getOwnerOfLicense(licenseType, licenseId), getLicense(licenseType, licenseId)]);
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
                    <Item label="Assign Timestamp" value={new Date(Number(assignTimestamp) * 1000).toLocaleString()} />
                </div>

                {/* Node */}
                <div className="min-w-[164px]">
                    {!isEmptyETHAddr(nodeAddress) && (
                        <SmallCard>
                            <div className="row gap-2.5">
                                <div className="h-9 w-1 rounded-full bg-primary-500"></div>

                                <div className="col font-medium">
                                    <CopyableAddress value={nodeAddress} />
                                </div>
                            </div>
                        </SmallCard>
                    )}
                </div>
            </div>
        </CardBordered>
    );
}
