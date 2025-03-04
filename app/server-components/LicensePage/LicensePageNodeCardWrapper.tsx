import * as types from '@/typedefs/blockchain';
import NodeCard from '../main-cards/NodeCard';

export default async function LicensePageNodeCardWrapper({
    cachedGetNodeAvailability,
}: {
    cachedGetNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
        await cachedGetNodeAvailability();

    if (!nodeResponse) {
        return null;
    }

    return <NodeCard nodeResponse={nodeResponse} hasLink />;
}
