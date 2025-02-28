import { LicenseUsageStats } from '@/app/server-components/shared/Licenses/LicenseUsageStats';
import { SmallCard } from '@/components/Licenses/SmallCard';
import { routePath } from '@/lib/routes';
import Link from 'next/link';
import { RiCpuLine } from 'react-icons/ri';

interface Props {
    licenseId: number;
    licenseType: 'ND' | 'MND' | 'GND' | undefined;
    totalAssignedAmount: bigint | undefined;
    totalClaimedAmount: bigint;
    isLink?: boolean;
}

export const LicenseSmallCard = ({ licenseId, licenseType, totalClaimedAmount, totalAssignedAmount, isLink }: Props) => {
    const getContent = () => (
        <SmallCard isHoverable={isLink}>
            <div className="col gap-1.5">
                <div className="row justify-between text-sm font-medium">
                    <div className="row gap-1 text-primary">
                        <RiCpuLine className="text-lg" />
                        <div className="">License #{Number(licenseId)}</div>
                    </div>

                    {licenseType && <div className="text-slate-500">{licenseType}</div>}
                </div>

                <div className="w-52">
                    <LicenseUsageStats totalClaimedAmount={totalClaimedAmount} totalAssignedAmount={totalAssignedAmount} />
                </div>
            </div>
        </SmallCard>
    );

    if (!isLink) {
        return getContent();
    }

    return <Link href={`${routePath.license}/${licenseType}/${licenseId}`}>{getContent()}</Link>;
};
