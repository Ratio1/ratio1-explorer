import * as types from '@/typedefs/blockchain';
import NodePerformanceCard from '../main-cards/NodePerformanceCard';

export default async function LicensePageNodePerformanceCardWrapper({
    cachedGetNodeAvailability,
}: {
    cachedGetNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
        await cachedGetNodeAvailability();

    if (!nodeResponse) {
        return null;
    }

    return <NodePerformanceCard nodeResponse={nodeResponse} />;
}
