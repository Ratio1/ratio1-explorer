'use client';

import { LicenseUsageStats } from '@/app/server-components/shared/Licenses/LicenseUsageStats';
import { routePath } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { RiCpuLine } from 'react-icons/ri';
import { SmallCard } from './SmallCard';

interface Props {
    licenseId: number;
    licenseType: 'ND' | 'MND' | 'GND' | undefined;
    totalAssignedAmount: bigint | undefined;
    totalClaimedAmount: bigint;
}

export const LicenseSmallCard = ({ licenseId, licenseType, totalClaimedAmount, totalAssignedAmount }: Props) => {
    const router = useRouter();

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                router.push(`${routePath.license}/${licenseId}`);
            }}
        >
            <SmallCard isHoverable>
                <div className="col gap-1.5">
                    <div className="row justify-between text-sm font-medium">
                        <div className="row gap-1 text-primary">
                            <RiCpuLine className="text-lg" />
                            <div className="leading-none">License #{Number(licenseId)}</div>
                        </div>

                        {licenseType && <div className="text-slate-400">{licenseType}</div>}
                    </div>

                    <div className="w-52">
                        <LicenseUsageStats totalClaimedAmount={totalClaimedAmount} totalAssignedAmount={totalAssignedAmount} />
                    </div>
                </div>
            </SmallCard>
        </div>
    );
};
