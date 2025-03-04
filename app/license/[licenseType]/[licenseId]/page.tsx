import LicenseCard from '@/app/server-components/main-cards/LicenseCard';
import NodeCard from '@/app/server-components/main-cards/NodeCard';
import NodePerformanceCard from '@/app/server-components/main-cards/NodePerformanceCard';
import { getLicense, getOwnerOfLicense } from '@/lib/api/blockchain';
import { getNodeAvailability, isEmptyETHAddr } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';

export async function generateMetadata({ params }) {
    const { licenseId } = await params;

    return {
        title: `License #${licenseId}`,
        openGraph: {
            title: `License #${licenseId}`,
        },
    };
}

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
                cachedGetNodeAvailability={cachedGetNodeAvailability}
            />

            <Suspense>
                <NodeCard cachedGetNodeAvailability={cachedGetNodeAvailability} hasLink />
            </Suspense>

            <Suspense>
                <NodePerformanceCard cachedGetNodeAvailability={cachedGetNodeAvailability} />
            </Suspense>
        </div>
    );
}
