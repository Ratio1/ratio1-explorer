import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import PoA from '../Licenses/PoA';
import { LargeTag } from '../shared/LargeTag';
import UsageStats from '../shared/Licenses/UsageStats';

interface Props {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    nodeEthAddress: types.EthAddress;
}

export default async function CompactLicenseCard({ license, licenseType, licenseId, nodeEthAddress }: Props) {
    return (
        <CardBordered>
            <Link href={`${routePath.license}/${licenseType}/${licenseId}`} className="hover:text-primary">
                <div className="row gap-2.5">
                    <div className="card-title font-bold">License #{licenseId}</div>
                    <LargeTag variant={licenseType}>{licenseType}</LargeTag>

                    {license.isBanned && <LargeTag variant="banned">Banned</LargeTag>}
                </div>
            </Link>

            <div className="flexible-row">
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
                        widthClasses="min-w-[250px]"
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
                />

                <PoA license={license} />

                {!isEmptyETHAddr(nodeEthAddress) && (
                    <CardHorizontal
                        label="Node"
                        value={
                            <CopyableAddress
                                value={nodeEthAddress}
                                size={4}
                                isLarge
                                link={`${routePath.node}/${nodeEthAddress}`}
                            />
                        }
                        isSmaller
                    />
                )}
            </div>
        </CardBordered>
    );
}
