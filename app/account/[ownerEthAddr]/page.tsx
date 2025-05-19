import CompactLicenseCard from '@/app/server-components/main-cards/CompactLicenseCard';
import { CardBordered } from '@/app/server-components/shared/cards/CardBordered';
import { CardHorizontal } from '@/app/server-components/shared/cards/CardHorizontal';
import UsageStats from '@/app/server-components/shared/Licenses/UsageStats';
import { CopyableAddress } from '@/components/shared/CopyableValue';
import { getServerConfig } from '@/config/serverConfig';
import { fetchErc20Balance, getLicenses } from '@/lib/api/blockchain';
import { cachedGetENSName, fBI, getShortAddress, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { isAddress } from 'viem';

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

    const ensName = await cachedGetENSName(ownerEthAddr);

    return {
        title: `Account • ${ensName || getShortAddress(ownerEthAddr, 4, true)}`,
        openGraph: {
            title: `Account • ${ensName || getShortAddress(ownerEthAddr, 4, true)}`,
        },
    };
}

export default async function OwnerPage({ params }) {
    const { ownerEthAddr } = await params;
    const { config } = await getServerConfig();

    if (!ownerEthAddr || !isAddress(ownerEthAddr) || isEmptyETHAddr(ownerEthAddr)) {
        notFound();
    }

    let licenses: types.LicenseInfo[], ensName: string | undefined, r1Balance: bigint;

    try {
        [licenses, ensName, r1Balance] = await Promise.all([
            getLicenses(ownerEthAddr),
            cachedGetENSName(ownerEthAddr),
            fetchErc20Balance(ownerEthAddr, config.r1ContractAddress),
        ]);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <div className="responsive-col">
            <CardBordered>
                <div className="card-title-big font-bold">
                    Account •{' '}
                    {ensName ? (
                        <span>{ensName}</span>
                    ) : (
                        <span className="roboto">{getShortAddress(ownerEthAddr, 4, true)}</span>
                    )}
                </div>

                <div className="col gap-3">
                    <div className="flexible-row">
                        <CardHorizontal
                            label="Address"
                            value={
                                <div>
                                    <CopyableAddress value={ownerEthAddr} size={4} isLarge />
                                </div>
                            }
                            isSmall
                            isFlexible
                        />

                        <CardHorizontal label="Licenses Owned" value={<div>{licenses.length}</div>} isSmall isFlexible />

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
            </CardBordered>

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
