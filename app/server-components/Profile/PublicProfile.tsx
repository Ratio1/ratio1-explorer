import ClientWrapper from '@/components/shared/ClientWrapper';
import { getBrandingPlatforms, getPublicProfileInfo } from '@/lib/api/backend';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import { EthAddress } from '@/typedefs/blockchain';
import { PublicProfileInfo } from '@/typedefs/general';
import Link from 'next/link';
import { RiGlobalLine, RiLinkedinBoxFill, RiTwitterXLine } from 'react-icons/ri';
import ProfileImage from './ProfileImage';

const PLATFORM_ICONS = {
    Linkedin: (
        <div className="text-[20px]">
            <RiLinkedinBoxFill />
        </div>
    ),
    X: (
        <div className="text-lg">
            <RiTwitterXLine />
        </div>
    ),
    Website: (
        <div className="text-lg">
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
            getPublicProfileInfo(ownerEthAddr),
        ]);

        if (brandsResponse.brands && brandsResponse.brands.length > 0) {
            publicProfileInfo = brandsResponse.brands[0];
        }
    } catch (error) {
        console.error(error);
        return null;
    }

    return (
        <div className="row gap-3">
            <div className="center-all relative h-[88px] w-[88px] overflow-hidden rounded-full">
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

                <div>
                    {publicProfileInfo?.description && <div className="compact-slate">{publicProfileInfo?.description}</div>}
                </div>

                <div className="row gap-4">
                    {brandingPlatforms.map((platform) => {
                        const link = publicProfileInfo?.links[platform];
                        const isEmptyLink = !link || link === '';

                        if (isEmptyLink) {
                            return null;
                        }

                        const shortLink = platform === 'Linkedin' ? link.slice(12) : link.slice(8);

                        return (
                            <div key={platform} className="row gap-1">
                                {PLATFORM_ICONS[platform] ?? platform}

                                <Link className="hover:opacity-75" href={link} target="_blank">
                                    <div className="text-sm font-medium text-primary">{shortLink}</div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
