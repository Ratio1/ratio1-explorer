import * as types from '@/typedefs/blockchain';
import { RiErrorWarningLine } from 'react-icons/ri';
import NodeCard from '../main-cards/NodeCard';
import { Alert } from '../shared/Alert';

export default async function LicensePageNodeCardWrapper({
    cachedGetNodeAvailability,
}: {
    cachedGetNodeAvailability: () => Promise<(types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined>;
}) {
    try {
        const nodeResponse: (types.OraclesAvailabilityResult & types.OraclesDefaultResult) | undefined =
            await cachedGetNodeAvailability();

        if (!nodeResponse) {
            return <ErrorAlert />;
        }

        return <NodeCard nodeResponse={nodeResponse} hasLink />;
    } catch (error) {
        console.log('Failed to fetch node data:', error);
        return <ErrorAlert />;
    }
}

function ErrorAlert() {
    return (
        <div className="w-full">
            <Alert
                variant="warning"
                icon={<RiErrorWarningLine className="text-lg" />}
                title="Unable to load node data"
                description="An error occurred while fetching node information."
            />
        </div>
    );
}
