import { SmallCard } from '@/app/server-components/shared/Licenses/SmallCard';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { getShortAddress, isEmptyETHAddr } from '@/lib/utils';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import Link from 'next/link';
import { RiEye2Line } from 'react-icons/ri';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';
import LicenseSmallCard from '../shared/Licenses/LicenseSmallCard';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    const { licenseId, licenseType, owner, totalAssignedAmount, totalClaimedAmount, isBanned } = await getNodeLicenseDetails(
        node.eth_addr,
    );

    // The node will soon be disconnected by dAuth
    if (!licenseId) {
        return null;
    }

    return (
        <CardBordered useCustomWrapper hasFixedWidth>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                <Link href={`${routePath.node}/${node.eth_addr}`} className="group w-[200px] py-3 lg:w-[228px]">
                    <div className="row gap-1.5">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium group-hover:text-primary lg:text-[15px]">
                            {node.alias}
                        </div>

                        {false && <RiEye2Line className="text-lg text-primary" />}
                    </div>
                </Link>

                {/* Node addresses */}
                <SmallCard>
                    <div className="row gap-2.5">
                        <div className="h-9 w-1 rounded-full bg-primary-500"></div>

                        <div className="col font-medium">
                            <CopyableAddress value={node.eth_addr} />
                            <CopyableAddress value={ratio1Addr} />
                        </div>
                    </div>
                </SmallCard>

                {/* License */}
                <LicenseSmallCard
                    licenseId={Number(licenseId)}
                    licenseType={licenseType}
                    totalAssignedAmount={totalAssignedAmount}
                    totalClaimedAmount={totalClaimedAmount}
                    isBanned={isBanned}
                    isLink
                />

                {/* Owner */}
                {!isEmptyETHAddr(owner) && (
                    <Item
                        label="Owner"
                        value={
                            <Link href={`${routePath.owner}/${owner}`}>
                                <div className="hover:opacity-50">{getShortAddress(owner)}</div>
                            </Link>
                        }
                    />
                )}

                <div className="min-w-[50px]">
                    <Item label="Version" value={<>{node.ver.split('|')[0]}</>} />
                </div>

                <Item
                    label="Last Epoch Availability"
                    value={<>{parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%</>}
                />
            </div>
        </CardBordered>
    );
}
