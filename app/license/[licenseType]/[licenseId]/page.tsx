import LicensePageNodeCardWrapper from '@/app/server-components/LicensePage/LicensePageNodeCardWrapper';
import LicensePageNodePerformanceCardWrapper from '@/app/server-components/LicensePage/LicensePageNodePerformanceCardWrapper';
import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { getNodeAvailability, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';

export async function generateMetadata({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        return {
            title: 'Error',
            openGraph: {
                title: 'Error',
            },
        };
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        return {
            title: 'Error',
            openGraph: {
                title: 'Error',
            },
        };
    }

    try {
        await cachedGetOwnerOfLicense(licenseType, licenseId);
    } catch (error) {
        return {
            title: 'Error',
            openGraph: {
                title: 'Error',
            },
        };
    }

    return {
        title: `License #${licenseId}`,
        openGraph: {
            title: `License #${licenseId}`,
        },
    };
}

const cachedGetOwnerOfLicense = cache(async (licenseType: 'ND' | 'MND' | 'GND', licenseId: string) => {
    return await getOwnerOfLicense(licenseType, licenseId);
});

export default async function LicensePage({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        notFound();
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        notFound();
    }

    let owner: types.EthAddress, license: types.License;

    try {
        [owner, license] = await Promise.all([getOwnerOfLicense(licenseType, licenseId), getLicense(licenseType, licenseId)]);
    } catch (error) {
        console.error(error);
        notFound();
    }

    const cachedGetNodeAvailability = cache(async () => {
        try {
            const isLinked = !isEmptyETHAddr(license.nodeAddress);

            if (!isLinked) {
                return;
            }

            return await getNodeAvailability(license.nodeAddress, license.assignTimestamp);
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <div className="col w-full flex-1 gap-6">
            <LicenseCard
                license={license}
                licenseType={licenseType}
                licenseId={licenseId}
                owner={owner}
                getNodeAvailability={cachedGetNodeAvailability}
            />

            <Suspense fallback={<Skeleton className="min-h-[310px] w-full rounded-2xl" />}>
                <LicensePageNodeCardWrapper cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>

            <Suspense fallback={<Skeleton className="min-h-[276px] w-full rounded-2xl" />}>
                <LicensePageNodePerformanceCardWrapper cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>
        </div>
    );
}
