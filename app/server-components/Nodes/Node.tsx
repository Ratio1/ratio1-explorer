import { SmallCard } from '@/app/server-components/shared/Licenses/SmallCard';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getNodeLicenseDetails } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import Link from 'next/link';
import { RiEye2Line } from 'react-icons/ri';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';
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
        <BorderedCard useCustomWrapper useFixedWidthLarge>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                <Link href={`${routePath.node}/${node.eth_addr}`} className="group min-w-[200px] py-3 lg:min-w-[228px]">
                    <div className="row gap-1.5">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium group-hover:text-primary lg:text-[15px]">
                            {node.alias}
                        </div>

                        {false && <RiEye2Line className="text-lg text-primary" />}
                    </div>
                </Link>

                {/* Node Addresses */}
                <div className="flex min-w-[164px]">
                    <SmallCard>
                        <div className="row gap-2.5">
                            <div className="h-9 w-1 rounded-full bg-primary-500"></div>

                            <div className="col font-medium">
                                <CopyableAddress value={node.eth_addr} />
                                <CopyableAddress value={ratio1Addr} />
                            </div>
                        </div>
                    </SmallCard>
                </div>

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
                    <div className="flex min-w-[112px]">
                        <CardItem
                            label="Owner"
                            value={<CopyableAddress value={owner} size={4} link={`${routePath.owner}/${owner}`} />}
                        />
                    </div>
                )}

                <div className="min-w-[50px]">
                    <CardItem label="Version" value={<>{node.ver.split('|')[0]}</>} />
                </div>

                <div className="min-w-[152px]">
                    <CardItem
                        label="Last Epoch Availability"
                        value={
                            <div className="text-left lg:text-right">
                                {parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%
                            </div>
                        }
                    />
                </div>
            </div>
        </BorderedCard>
    );
}
