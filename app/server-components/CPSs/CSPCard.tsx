import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { routePath } from '@/lib/routes';
import { cachedGetENSName, fBI, getShortAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import Link from 'next/link';
import ProfileImage from '../Profile/ProfileImage';
import { CardItem } from '../shared/CardItem';
import { BorderedCard } from '../shared/cards/BorderedCard';

export default async function CSPCard({ csp }: { csp: types.CSP }) {
    let ensName: string | undefined;

    try {
        ensName = await cachedGetENSName(csp.owner);
    } catch (error) {
        console.error(error);
    }

    const getLinkWrapper = (children: React.ReactNode) => (
        <Link href={`${routePath.account}/${csp.owner}`} className="font-medium text-body hover:text-primary">
            <div className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">{children}</div>
        </Link>
    );

    return (
        <BorderedCard useCustomWrapper useFixedWidthSmall>
            <div className="row justify-between gap-3 py-2 md:py-3 lg:gap-6">
                <div className="min-w-[280px]">
                    <CardItem
                        value={
                            <div className="row gap-2">
                                <div className="center-all relative mr-0.5 h-[32px] w-[32px] min-w-[32px] overflow-hidden rounded-[37.5%]">
                                    <ClientWrapper>
                                        <ProfileImage ownerEthAddr={csp.owner} isSmall />
                                    </ClientWrapper>
                                </div>

                                {getLinkWrapper(
                                    csp?.name || ensName || (
                                        <div className="text-slate-400 hover:text-primary">{getShortAddress(csp.owner, 4)}</div>
                                    ),
                                )}
                            </div>
                        }
                    />
                </div>

                <div className="flex min-w-[130px]">
                    <CardItem label="Escrow SC. Address" value={<CopyableAddress value={csp.escrowAddress} size={4} />} />
                </div>

                <div className="flex min-w-[70px]">
                    <CardItem label="TVL" value={fBI(csp.tvl, 6)} />
                </div>

                <div className="flex min-w-[100px]">
                    <CardItem label="Active Jobs" value={csp.activeJobsCount} />
                </div>
            </div>
        </BorderedCard>
    );
}
