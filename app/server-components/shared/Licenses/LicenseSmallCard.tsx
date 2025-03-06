import { SmallCard } from '@/app/server-components/shared/Licenses/SmallCard';
import { routePath } from '@/lib/routes';
import Link from 'next/link';
import { RiCpuLine } from 'react-icons/ri';
import { SmallTag } from '../SmallTag';
import UsageStats from './UsageStats';

interface Props {
    licenseId: number;
    licenseType: 'ND' | 'MND' | 'GND' | undefined;
    totalAssignedAmount: bigint | undefined;
    totalClaimedAmount: bigint;
    isBanned: boolean;
    isLink?: boolean;
    hideType?: boolean;
}

export default async function LicenseSmallCard({
    licenseId,
    licenseType,
    totalClaimedAmount,
    totalAssignedAmount,
    isBanned,
    isLink,
    hideType,
}: Props) {
    const getContent = () => (
        <SmallCard isHoverable={isLink}>
            <div className="col gap-1.5">
                <div className="row justify-between text-sm font-medium">
                    <div className="row gap-1 text-primary">
                        <RiCpuLine className="text-lg" />
                        <div className="">License #{Number(licenseId)}</div>
                    </div>

                    {isBanned ? (
                        <SmallTag variant="banned">Banned</SmallTag>
                    ) : !!licenseType && !hideType ? (
                        <SmallTag>{licenseType}</SmallTag>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="w-52">
                    <UsageStats totalClaimedAmount={totalClaimedAmount} totalAssignedAmount={totalAssignedAmount} />
                </div>
            </div>
        </SmallCard>
    );

    if (!licenseId) {
        return null;
    }

    if (!isLink) {
        return getContent();
    }

    return <Link href={`${routePath.license}/${licenseType}/${licenseId}`}>{getContent()}</Link>;
}
