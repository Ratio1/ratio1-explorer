import ClientWrapper from '@/components/shared/ClientWrapper';
import { getBrandingPlatforms, getPublicProfileInfo } from '@/lib/api/backend';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import { EthAddress } from '@/typedefs/blockchain';
import { PublicProfileInfo } from '@/typedefs/general';
import Link from 'next/link';
import { RiGlobalLine, RiLinkedinBoxFill, RiTwitterXLine } from 'react-icons/ri';
import { BorderedCard } from '../shared/cards/BorderedCard';
import { CardHorizontal } from '../shared/cards/CardHorizontal';
import ProfileImage from './ProfileImage';

const PLATFORM_ICONS = {
    Linkedin: <RiLinkedinBoxFill />,
    X: <RiTwitterXLine />,
    Website: <RiGlobalLine />,
};

export default async function PublicProfile({ ownerEthAddr }: { ownerEthAddr: EthAddress }) {
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

        console.log('[PublicProfile]', { brandsResponse });

        if (brandsResponse.brands && brandsResponse.brands.length > 0) {
            publicProfileInfo = brandsResponse.brands[0];
            console.log('[PublicProfile] publicProfileInfo', publicProfileInfo);
        }
    } catch (error) {
        console.error(error);
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
                            label={PLATFORM_ICONS[platform] ?? platform}
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
