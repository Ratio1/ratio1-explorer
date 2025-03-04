import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardFlexible } from '@/app/server-components/shared/cards/CardFlexible';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import { routePath } from '@/lib/routes';
import { getShortAddress, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import { RiCpuLine } from 'react-icons/ri';
import { formatUnits } from 'viem';
import { LargeTag } from '../shared/LargeTag';
import LicenseUsageStats from '../shared/Licenses/LicenseUsageStats';

interface Props {
    license: types.License;
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: string;
    nodeEthAddress: types.EthAddress;
}

export default async function CompactLicenseCard({ license, licenseType, licenseId, nodeEthAddress }: Props) {
    return (
        <CardBordered>
            <div className="col w-full gap-5 bg-white px-6 py-6">
                <div className="col w-full gap-5">
                    <Link href={`${routePath.license}/${licenseType}/${licenseId}`} className="hover:text-primary">
                        <div className="row gap-2.5">
                            <div className="text-2xl font-bold">License #{licenseId}</div>
                            <LargeTag variant={licenseType}>{licenseType}</LargeTag>

                            {license.isBanned && <LargeTag variant="banned">Banned</LargeTag>}
                        </div>
                    </Link>

                    <div className="col gap-3">
                        {/* Row 1 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            {!!license.assignTimestamp && (
                                <CardHorizontal
                                    label="Assign timestamp"
                                    value={new Date(Number(license.assignTimestamp) * 1000).toLocaleString()}
                                    isSmall
                                    isFlexible
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

                            {!!license.lastClaimEpoch && (
                                <CardHorizontal label="Last claimed epoch" value={license.lastClaimEpoch.toString()} isSmall />
                            )}
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-wrap items-stretch gap-3">
                            <CardFlexible>
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
                                                    formatUnits(license.totalAssignedAmount - license.totalClaimedAmount, 18),
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

                            {!isEmptyETHAddr(nodeEthAddress) && (
                                <CardHorizontal
                                    label="Node"
                                    value={
                                        <Link href={`${routePath.node}/${nodeEthAddress}`} className="hover:text-primary">
                                            {getShortAddress(nodeEthAddress)}
                                        </Link>
                                    }
                                    isSmall
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CardBordered>
    );
}
