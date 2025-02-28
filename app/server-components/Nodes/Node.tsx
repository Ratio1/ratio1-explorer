import { LicenseSmallCard } from '@/components/Licenses/LicenseSmallCard';
import { SmallCard } from '@/components/Licenses/SmallCard';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getMNDLicense, getNDLicense, getNodeToLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { NodeState, R1Address } from '@/typedefs/blockchain';
import Link from 'next/link';
import { CardBordered } from '../shared/cards/CardBordered';
import { Item } from '../shared/Item';

export default async function Node({ ratio1Addr, node }: { ratio1Addr: R1Address; node: NodeState }) {
    const { licenseId, licenseType } = await getNodeToLicense(node.eth_addr);

    let totalAssignedAmount: bigint | undefined,
        totalClaimedAmount: bigint = 0n;

    if (licenseType === 'ND') {
        ({ totalClaimedAmount } = await getNDLicense(licenseId));
    } else {
        ({ totalAssignedAmount, totalClaimedAmount } = await getMNDLicense(licenseId));
    }

    return (
        <Link href={`${routePath.node}/${node.eth_addr}`}>
            <CardBordered isHoverable>
                <div className="row w-full justify-between gap-6 bg-white px-6 py-3">
                    <div className="w-[228px] overflow-hidden text-ellipsis whitespace-nowrap font-medium">{node.alias}</div>

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
                    />

                    <div className="min-w-[50px]">
                        <Item label="Version" value={<>{node.ver.split('|')[0]}</>} />
                    </div>

                    <Item
                        label="Last Epoch Availability"
                        value={<>{parseFloat((node.recent_history.last_epoch_avail * 100).toFixed(2))}%</>}
                    />
                </div>
            </CardBordered>
        </Link>
    );
}
