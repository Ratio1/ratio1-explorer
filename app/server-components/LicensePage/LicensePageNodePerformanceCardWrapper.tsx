import * as types from '@/typedefs/blockchain';
import NodePerformanceCard from '../main-cards/NodePerformanceCard';

export default async function LicensePageNodePerformanceCardWrapper({
    cachedGetNodeAvailability,
}: {
    cachedGetNodeAvailability: () => Promise<types.OraclesAvailabilityResult | undefined>;
}) {
    const nodeResponse: types.OraclesAvailabilityResult | undefined = await cachedGetNodeAvailability();

    if (!nodeResponse) {
        return null;
    }

    return <NodePerformanceCard nodeResponse={nodeResponse} />;
}
