import ClientWrapper from '@/components/shared/ClientWrapper';
import { getBrandingPlatforms, getPublicProfiles } from '@/lib/api/backend';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import { EthAddress } from '@/typedefs/blockchain';
import { PublicProfileInfo } from '@/typedefs/general';
import Link from 'next/link';
import { RiGlobalLine, RiLinkedinBoxFill, RiTwitterXLine } from 'react-icons/ri';
import ProfileImage from './ProfileImage';

const PLATFORM_ICONS = {
    Linkedin: (
        <div className="text-[22px]">
            <RiLinkedinBoxFill />
        </div>
    ),
    X: (
        <div className="text-xl">
            <RiTwitterXLine />
        </div>
    ),
    Website: (
        <div className="text-xl">
            <RiGlobalLine />
        </div>
    ),
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
            getPublicProfiles([ownerEthAddr]),
        ]);

        if (brandsResponse.brands && brandsResponse.brands.length > 0) {
            publicProfileInfo = brandsResponse.brands[0];
            console.log('[PublicProfile]', { publicProfileInfo });
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    if (!publicProfileInfo) {
        return (
            <div className="card-title-big font-bold">
                Node Operator •{' '}
                {ensName ? <>{ensName}</> : <span className="roboto">{getShortAddress(ownerEthAddr, 4, true)}</span>}
            </div>
        );
    }

    return (
        <div className="flex items-start gap-3 md:items-center md:gap-4">
            <div className="center-all relative h-[60px] w-[60px] min-w-[60px] overflow-hidden rounded-[37.5%] sm:h-[84px] sm:w-[84px] sm:min-w-[84px]">
                <ClientWrapper>
                    <ProfileImage ownerEthAddr={ownerEthAddr} />
                </ClientWrapper>
            </div>

            <div className="col gap-2">
                <div className="col gap-0.5">
                    <div className="card-title-big font-bold !leading-none">
                        {publicProfileInfo?.name ? (
                            <>{publicProfileInfo.name}</>
                        ) : ensName ? (
                            <>{ensName}</>
                        ) : (
                            <span className="roboto">{getShortAddress(ownerEthAddr, 4, true)}</span>
                        )}
                    </div>

                    {publicProfileInfo?.description && (
                        <div className="font-medium leading-5 text-slate-500">{publicProfileInfo?.description}</div>
                    )}
                </div>

                {!!publicProfileInfo?.links && Object.keys(publicProfileInfo?.links).length > 0 && (
                    <div className="row gap-2">
                        {brandingPlatforms.map((platform) => {
                            const link = publicProfileInfo?.links?.[platform];
                            const isEmptyLink = !link || link === '';

                            if (isEmptyLink) {
                                return null;
                            }

                            return (
                                <Link key={platform} className="hover:text-primary" href={link} target="_blank">
                                    <div>{PLATFORM_ICONS[platform] ?? platform}</div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
