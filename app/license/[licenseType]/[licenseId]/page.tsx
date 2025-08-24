import LicensePageNodeCardWrapper from '@/app/server-components/LicensePage/LicensePageNodeCardWrapper';
import LicensePageNodePerformanceCardWrapper from '@/app/server-components/LicensePage/LicensePageNodePerformanceCardWrapper';
import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import config from '@/config';
import { getNodeAvailability } from '@/lib/actions';
import { getLicense } from '@/lib/api/blockchain';
import { routePath } from '@/lib/routes';
import { isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { notFound, redirect } from 'next/navigation';
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
        await cachedGetLicense(licenseType, licenseId, config.environment);
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

const cachedGetLicense = cache(
    async (licenseType: 'ND' | 'MND' | 'GND', licenseId: string, _environment: 'mainnet' | 'testnet' | 'devnet') => {
        return await getLicense(licenseType, licenseId);
    },
);

export default async function LicensePage({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        console.log(`[License Page] Invalid license type: ${licenseType}`);
        notFound();
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        console.log(`[License Page] Invalid license ID: ${licenseId}`);
        notFound();
    }

    let license: types.License;

    try {
        license = await cachedGetLicense(licenseType, licenseId, config.environment);
        console.log('[LicensePage] cachedGetLicense', license);
    } catch (error) {
        console.error(error);
        console.log(`[License Page] Failed to fetch license: ${licenseType}-${licenseId}`);
        redirect(routePath.notFound);
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
        <div className="responsive-col">
            <LicenseCard
                license={license}
                licenseType={licenseType}
                licenseId={licenseId}
                owner={license.owner}
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
