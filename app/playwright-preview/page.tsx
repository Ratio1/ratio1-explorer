import LicenseRewardsPoA from '@/app/server-components/Licenses/LicenseRewardsPoA';
import NodeCard from '@/app/server-components/main-cards/NodeCard';
import NodePerformanceCard from '@/app/server-components/main-cards/NodePerformanceCard';
import { BorderedCard } from '@/app/server-components/shared/cards/BorderedCard';
import SyncingOraclesTag from '@/app/server-components/shared/SyncingOraclesTag';
import { getEpochStartTimestamp } from '@/config';
import * as types from '@/typedefs/blockchain';
import { notFound } from 'next/navigation';

/*
Public preview route for Playwright-based UI screenshots.
Swap the component tree inside section id="playwright-preview" when validating UI changes.
Keep this page deterministic and independent from auth/API/blockchain calls.
*/

const isDevelopment = process.env.NODE_ENV === 'development';

export default function PlaywrightPreviewPage() {
    if (!isDevelopment) {
        notFound();
    }

    const assignTimestamp = BigInt(Math.floor(getEpochStartTimestamp(1).getTime() / 1000));
    const nodeEthAddress = '0x1111111111111111111111111111111111111111' as types.EthAddress;
    const ownerAddress = '0x2222222222222222222222222222222222222222' as types.EthAddress;
    const nodeResponse = {
        node: '0xai_mocked_preview_node_address_000000000000000000',
        node_alias: 'Mock Syncing Node',
        node_eth_address: nodeEthAddress,
        epochs: [],
        epochs_vals: [],
        error: 'No epochs found for the given node',
        eth_signed_data: {
            input: [],
            signature_field: '',
        },
        eth_signatures: [],
        eth_addresses: [],
        node_is_online: true,
        node_is_oracle: false,
        node_version: 'ratio1-node|2.4.1|preview',
        node_last_seen_sec: 76,
        resources: {
            cpu_cores: 16,
            cpu_cores_avail: 12.5,
            default_cuda: {
                cpu: 0,
                'cuda:0': 0,
            },
            disk_avail: 415.4,
            disk_total: 512,
            mem_avail: 48.3,
            mem_total: 64,
        },
        tags: ['preview', 'syncing'],
        availability_status: 'syncing',
        server_current_epoch: 10,
        server_last_synced_epoch: 8,
    } satisfies types.OraclesAvailabilityResult;
    const license = {
        nodeAddress: nodeEthAddress,
        totalAssignedAmount: 1_000_000n * 10n ** 18n,
        totalClaimedAmount: 125_000n * 10n ** 18n,
        awbBalance: 0n,
        lastClaimEpoch: 2n,
        assignTimestamp,
        lastClaimOracle: ownerAddress,
        isBanned: false,
        owner: ownerAddress,
        r1PoaiRewards: 0n,
        usdcPoaiRewards: 0n,
    } satisfies types.License;

    return (
        <main className="col mx-auto w-full max-w-5xl gap-6 p-4 md:p-8">
            <section id="playwright-preview" className="responsive-col">
                <BorderedCard>
                    <div className="row flex-wrap items-center gap-2.5">
                        <div className="card-title font-bold">Direct tag</div>
                        <SyncingOraclesTag />
                    </div>
                </BorderedCard>

                <NodeCard nodeResponse={nodeResponse} />
                <NodePerformanceCard nodeResponse={nodeResponse} />

                <BorderedCard>
                    <div className="card-title font-bold">PoA rewards</div>
                    <LicenseRewardsPoA
                        license={license}
                        licenseType="ND"
                        licenseId="42"
                        getNodeAvailability={() => Promise.resolve(nodeResponse)}
                    />
                </BorderedCard>
            </section>
        </main>
    );
}
