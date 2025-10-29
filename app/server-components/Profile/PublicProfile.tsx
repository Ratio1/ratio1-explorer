import ClientWrapper from '@/components/shared/ClientWrapper';
import { getBrandingPlatforms } from '@/lib/api/backend';
import { cachedGetENSName, getShortAddress } from '@/lib/utils';
import { EthAddress } from '@/typedefs/blockchain';
import { PublicProfileInfo } from '@/typedefs/general';
import clsx from 'clsx';
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

export default async function PublicProfile({
    ownerEthAddr,
    publicProfileInfo,
}: {
    ownerEthAddr: EthAddress;
    publicProfileInfo?: PublicProfileInfo;
}) {
    let ensName: string | undefined,
        brandingPlatforms: string[] = [];

    try {
        [ensName, brandingPlatforms] = await Promise.all([cachedGetENSName(ownerEthAddr), getBrandingPlatforms()]);
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

    const hasDescription: boolean = !!publicProfileInfo?.description && publicProfileInfo?.description !== '';
    const hasSocialLinks: boolean = !!publicProfileInfo?.links && Object.keys(publicProfileInfo?.links).length > 0;

    return (
        <div
            className={clsx('flex items-center gap-3 md:items-center md:gap-4', {
                '!items-start': hasDescription || hasSocialLinks,
            })}
        >
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

                    {hasDescription && (
                        <div className="font-medium leading-5 text-slate-500">{publicProfileInfo?.description}</div>
                    )}
                </div>

                {hasSocialLinks && (
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
