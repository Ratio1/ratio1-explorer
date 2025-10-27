import ClientWrapper from '@/components/shared/ClientWrapper';
import { getBrandingPlatforms, getPublicProfileInfo } from '@/lib/api/backend';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import { PublicProfileInfo } from '@/typedefs/general';
import Link from 'next/link';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import ProfileImage from './ProfileImage';

export default async function PublicProfile({ ownerEthAddr }) {
    let ensName: string | undefined,
        brandingPlatforms: string[] = [],
        brandsResponse: { brands: Array<PublicProfileInfo> } = { brands: [] },
        publicProfileInfo: PublicProfileInfo | undefined;

    try {
        [ensName, brandingPlatforms, brandsResponse] = await Promise.all([
            cachedGetENSName(ownerEthAddr),
            getBrandingPlatforms(),
            getPublicProfileInfo(ownerEthAddr),
        ]);

        publicProfileInfo = brandsResponse.brands[0];

        console.log('[PublicProfile] publicProfileInfo', publicProfileInfo);
    } catch (error) {
        console.error(error);
        console.log(`[PublicProfile] Failed to fetch ENS name for address: ${ownerEthAddr}`);
        return null;
    }

    return (
        <BorderedCard>
            <div className="row gap-2.5">
                <div className="center-all relative h-[56px] w-[56px] overflow-hidden rounded-full">
                    <ClientWrapper>
                        <ProfileImage ownerEthAddr={ownerEthAddr} />
                    </ClientWrapper>
                </div>

                <div className="col gap-1">
                    <div className="card-title-big font-bold !leading-none">
                        {publicProfileInfo?.name ? (
                            <span>{publicProfileInfo.name}</span>
                        ) : ensName ? (
                            <span>{ensName}</span>
                        ) : (
                            <span className="roboto">{getShortAddress(ownerEthAddr, 4, true)}</span>
                        )}
                    </div>

                    {publicProfileInfo?.description && (
                        <div className="text-[15px] font-medium leading-none text-slate-500">
                            {publicProfileInfo?.description}
                        </div>
                    )}
                </div>
            </div>

            <div className="flexible-row">
                {brandingPlatforms.map((platform) => {
                    const link = publicProfileInfo?.links[platform];
                    const isEmptyLink = !link || link === '';

                    return (
                        <CardHorizontal
                            key={platform}
                            label={platform}
                            value={
                                isEmptyLink ? (
                                    <div>—</div>
                                ) : (
                                    <Link className="hover:text-primary" href={link} target="_blank">
                                        {link}
                                    </Link>
                                )
                            }
                            isSmall
                            isFlexible
                        />
                    );
                })}
            </div>
        </BorderedCard>
    );
}
