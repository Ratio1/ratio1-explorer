import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import { fBI, isZeroAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import PoA from '../Licenses/PoA';
import { LargeTag } from '../shared/LargeTag';
import UsageStats from '../shared/Licenses/UsageStats';

interface Props {
    license: types.CachedLicense;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    nodeEthAddress: types.EthAddress;
}

export default async function CompactLicenseCard({ license, licenseType, licenseId, nodeEthAddress }: Props) {
    const totalAssignedAmount = BigInt(license.totalAssignedAmount);
    const totalClaimedAmount = BigInt(license.totalClaimedAmount);
    const awbBalance = BigInt(license.awbBalance ?? '0');

    return (
        <BorderedCard>
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
                        label="Last claim epoch"
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
                                totalClaimedAmount={totalClaimedAmount}
                                totalAssignedAmount={totalAssignedAmount}
                                awbBalance={awbBalance}
                            />
                        </div>
                    }
                    isSmall
                />

                {licenseType !== 'ND' && (
                    <>
                        <CardHorizontal
                            label="Adoption Withheld Buffer"
                            value={<div className="text-orange-500">{fBI(awbBalance, 18)} $R1</div>}
                            isSmall
                            isFlexible
                            widthClasses="min-w-[360px]"
                        />
                    </>
                )}

                <PoA totalAssignedAmount={totalAssignedAmount} totalClaimedAmount={totalClaimedAmount} />

                {!isZeroAddress(nodeEthAddress) && (
                    <CardHorizontal
                        label="Node"
                        value={
                            <ClientWrapper>
                                <CopyableAddress
                                    value={nodeEthAddress}
                                    size={4}
                                    isLarge
                                    link={`${routePath.node}/${nodeEthAddress}`}
                                />
                            </ClientWrapper>
                        }
                        isSmaller
                    />
                )}
            </div>
        </BorderedCard>
    );
}
