import CompactLicenseCard from '@/app/server-components/main-cards/CompactLicenseCard';
import PublicProfile from '@/app/server-components/Profile/PublicProfile';
import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import UsageStats from '@/app/server-components/shared/Licenses/UsageStats';
import ClientWrapper from '@/components/shared/ClientWrapper';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import config from '@/config';
import { fetchErc20Balance, getLicenses } from '@/lib/api/blockchain';
import { getPublicProfiles } from '@/lib/api/backend';
import { routePath } from '@/lib/routes';
import { cachedGetENSName, fBI, getShortAddress, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import type { PublicProfileInfo } from '@/typedefs/general';
import { unstable_cache } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import { isAddress } from 'viem';

const getCachedNodeOperatorProfile = unstable_cache(
    async (ownerEthAddr: types.EthAddress): Promise<PublicProfileInfo | undefined> => {
        const response = await getPublicProfiles([ownerEthAddr]);

        if (!response?.brands || response.brands.length === 0) {
            return undefined;
        }

        return response.brands[0];
    },
    ['account:nodeOperatorProfile'],
    { revalidate: 60 },
);

export async function generateMetadata({ params }) {
    const { ownerEthAddr } = await params;

    if (!ownerEthAddr || !isAddress(ownerEthAddr) || isEmptyETHAddr(ownerEthAddr)) {
        return {
            title: 'Error',
            openGraph: {
                title: 'Error',
            },
        };
    }

    try {
        const [ensName, publicProfile] = await Promise.all([
            cachedGetENSName(ownerEthAddr),
            getCachedNodeOperatorProfile(ownerEthAddr as types.EthAddress),
        ]);

        const primaryName = publicProfile?.name || ensName || getShortAddress(ownerEthAddr, 4, true);

        return {
            title: `Node Operator • ${primaryName}`,
            openGraph: {
                title: `Node Operator • ${primaryName}`,
            },
        };
    } catch (error) {
        return null;
    }
}

export default async function NodeOperatorPage({ params }) {
    const { ownerEthAddr } = await params;

    if (!ownerEthAddr || !isAddress(ownerEthAddr) || isEmptyETHAddr(ownerEthAddr)) {
        console.log(`[NodeOperatorPage] Invalid owner address: ${ownerEthAddr}`);
        notFound();
    }

    let licenses: types.LicenseInfo[],
        ensName: string | undefined,
        r1Balance: bigint,
        publicProfileInfo: PublicProfileInfo | undefined;

    try {
        [licenses, ensName, r1Balance, publicProfileInfo] = await Promise.all([
            getLicenses(ownerEthAddr),
            cachedGetENSName(ownerEthAddr),
            fetchErc20Balance(ownerEthAddr, config.r1ContractAddress),
            getCachedNodeOperatorProfile(ownerEthAddr as types.EthAddress),
        ]);
    } catch (error) {
        console.error(error);
        console.log(`[Node Operator Page] Failed to fetch data for address: ${ownerEthAddr}`);
        redirect(routePath.notFound);
    }

    return (
        <div className="responsive-col">
            <BorderedCard>
                <PublicProfile ownerEthAddr={ownerEthAddr} publicProfileInfo={publicProfileInfo} />

                <div className="col gap-3 pt-2">
                    <div className="flexible-row">
                        <CardHorizontal
                            label="Address"
                            value={
                                <div>
                                    <ClientWrapper>
                                        <CopyableAddress value={ownerEthAddr} size={4} isLarge />
                                    </ClientWrapper>
                                </div>
                            }
                            isSmall
                            isFlexible
                        />

                        <CardHorizontal
                            label="Licenses Owned"
                            value={<div>{licenses.length}</div>}
                            isSmall
                            isFlexible
                            widthClasses="min-w-[180px]"
                        />

                        <CardHorizontal
                            label="Total $R1 Claimed"
                            value={
                                <div className="text-primary">
                                    {fBI(
                                        licenses.reduce((acc, license) => acc + license.totalClaimedAmount, 0n),
                                        18,
                                    )}
                                </div>
                            }
                            isSmall
                            isFlexible
                            widthClasses="min-w-[268px]"
                        />

                        <CardHorizontal
                            label="Licenses Usage (Total)"
                            value={
                                <div className="w-full min-w-52 xs:min-w-56 md:min-w-60">
                                    <UsageStats
                                        totalClaimedAmount={licenses.reduce(
                                            (acc, license) => acc + license.totalClaimedAmount,
                                            0n,
                                        )}
                                        totalAssignedAmount={licenses.reduce(
                                            (acc, license) => acc + license.totalAssignedAmount,
                                            0n,
                                        )}
                                    />
                                </div>
                            }
                            isSmall
                            isFlexible
                            widthClasses="min-[520px]:min-w-[440px] md:max-w-[500px]"
                        />

                        <CardHorizontal
                            label="Wallet $R1 Balance"
                            value={<div className="text-primary">{fBI(r1Balance, 18)}</div>}
                            isSmall
                        />
                    </div>
                </div>
            </BorderedCard>

            {licenses.map((license, index) => (
                <div key={index}>
                    <CompactLicenseCard
                        license={license}
                        licenseType={license.licenseType}
                        licenseId={license.licenseId.toString()}
                        nodeEthAddress={license.nodeAddress}
                    />
                </div>
            ))}
        </div>
    );
}
