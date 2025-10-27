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
            <div className="center-all relative h-[84px] w-[84px] overflow-hidden rounded-[40%]">
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

                <div className="row gap-2">
                    {brandingPlatforms.map((platform) => {
                        const link = publicProfileInfo?.links[platform];
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
            </div>
        </div>
    );
}
