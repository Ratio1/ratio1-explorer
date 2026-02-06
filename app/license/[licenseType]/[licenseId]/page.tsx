import LicensePageNodeCardWrapper from '@/app/server-components/LicensePage/LicensePageNodeCardWrapper';
import LicensePageNodePerformanceCardWrapper from '@/app/server-components/LicensePage/LicensePageNodePerformanceCardWrapper';
import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import ErrorComponent from '@/app/server-components/shared/ErrorComponent';
import config from '@/config';
import { getNodeAvailability } from '@/lib/actions';
import { getLicense } from '@/lib/api/blockchain';
import { isZeroAddress } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Skeleton } from '@heroui/skeleton';
import { cache, Suspense } from 'react';

export async function generateMetadata({ params }) {
    const { licenseType, licenseId } = await params;
    const errorMetadata = {
        title: 'Error',
        openGraph: {
            title: 'Error',
        },
    };

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        return errorMetadata;
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        return errorMetadata;
    }

    const canonical = `/license/${encodeURIComponent(licenseType)}/${encodeURIComponent(licenseId)}`;
    const errorMetadataWithCanonical = {
        ...errorMetadata,
        alternates: {
            canonical,
        },
    };

    try {
        await fetchLicense(licenseType, licenseId, config.environment);
    } catch (error) {
        return errorMetadataWithCanonical;
    }

    return {
        title: `License #${licenseId}`,
        openGraph: {
            title: `License #${licenseId}`,
        },
        alternates: {
            canonical,
        },
    };
}

const fetchLicense = async (
    licenseType: 'ND' | 'MND' | 'GND',
    licenseId: string,
    _environment: 'mainnet' | 'testnet' | 'devnet',
) => {
    return await getLicense(licenseType, licenseId);
};

export default async function LicensePage({ params }) {
    const { licenseType, licenseId } = await params;

    if (!licenseType || !['ND', 'MND', 'GND'].includes(licenseType)) {
        console.log(`[License Page] Invalid license type: ${licenseType}`);
        return <NotFound />;
    }

    const licenseIdNum = parseInt(licenseId);

    if (isNaN(licenseIdNum) || licenseIdNum < 0 || licenseIdNum > 10000) {
        console.log(`[License Page] Invalid license ID: ${licenseId}`);
        return <NotFound />;
    }

    let license: types.License;

    try {
        license = await fetchLicense(licenseType, licenseId, config.environment);
    } catch (error) {
        console.error(error);
        console.log(`[License Page] Failed to fetch license: ${licenseType}-${licenseId}`);
        return <NotFound />;
    }

    const cachedGetNodeAvailability = cache(async () => {
        try {
            const isLinked = !isZeroAddress(license.nodeAddress);

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

            <Suspense fallback={<Skeleton className="min-h-[325.5px] w-full rounded-2xl" />}>
                <LicensePageNodeCardWrapper cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>

            <Suspense fallback={<Skeleton className="min-h-[272px] w-full rounded-2xl" />}>
                <LicensePageNodePerformanceCardWrapper cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>
        </div>
    );
}

function NotFound() {
    return (
        <ErrorComponent
            title="License Not Found"
            description="The license you are looking for could not be found. The license ID might be incorrect."
        />
    );
}
