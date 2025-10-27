import ClientWrapper from '@/components/shared/ClientWrapper';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import { BorderedCard } from '../shared/cards/BorderedCard';
import ProfileImage from './ProfileImage';

export default async function PublicProfile({ ownerEthAddr }) {
    let ensName: string | undefined;

    try {
        ensName = await cachedGetENSName(ownerEthAddr);
    } catch (error) {
        console.error(error);
        console.log(`[PublicProfile] Failed to fetch ENS name for address: ${ownerEthAddr}`);
        return null;
    }

    return (
        <BorderedCard>
            <div className="row gap-2.5">
                <div className="center-all relative h-[44px] w-[44px] overflow-hidden rounded-full">
                    <ClientWrapper>
                        <ProfileImage ownerEthAddr={ownerEthAddr} />
                    </ClientWrapper>
                </div>

                <div className="col">
                    <div className="card-title-big font-bold !leading-6">
                        {ensName ? (
                            <span>{ensName}</span>
                        ) : (
                            <span className="roboto">{getShortAddress(ownerEthAddr, 4, true)}</span>
                        )}
                    </div>

                    <div className="text-[15px] font-medium !leading-6 text-slate-500">
                        A reliable node operator from Romania
                    </div>
                </div>
            </div>
        </BorderedCard>
    );
}
