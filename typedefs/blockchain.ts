type R1Address = `0xai${string}`;
type EthAddress = `0x${string}`;

type License = {
    nodeAddress: EthAddress;
    totalAssignedAmount: bigint;
    totalClaimedAmount: bigint;
    lastClaimEpoch: bigint;
    assignTimestamp: bigint;
    lastClaimOracle: EthAddress;
    isBanned: boolean;
    owner: EthAddress;
    r1PoaiRewards: bigint;
};

type NodeLicenseDetailsResponse = License & {
    licenseId: bigint;
    licenseType: 'ND' | 'MND' | 'GND' | undefined;
    owner: EthAddress;
};

type LicenseInfo = License & {
    licenseType: 'ND' | 'MND' | 'GND';
    licenseId: bigint;
    isLinked: boolean;
};

type ComputeParam = {
    licenseId: bigint;
    nodeAddress: `0x${string}`;
    epochs: bigint[];
    availabilies: number[];
};

type OraclesAvailabilityResult = {
    node: string;
    node_alias: string;
    node_eth_address: EthAddress;
    epochs: number[];
    epochs_vals: number[];
    eth_signed_data: EthSignedData;
    eth_signatures: EthAddress[];
    eth_addresses: EthAddress[];
    node_is_online: boolean;
    node_is_oracle: boolean;
    node_version: string;
    node_last_seen_sec: number;
    resources: Resources;
    tags?: string[];
};

type EthSignedData = {
    input: string[];
    signature_field: string;
};

type BuyLicenseRequest = {
    name: string;
    surname: string;
    isCompany: boolean;
    identificationCode: string;
    address: string;
    state: string;
    city: string;
    country: string;
};

type NodeState = {
    eth_addr: EthAddress;
    alias: string;
    last_state: string;
    last_seen_ago: string;
    non_zero: number;
    overall_availability: number;
    score: number;
    first_check: string;
    last_check: string;
    recent_history: {
        last_10_ep: string;
        certainty: string;
        last_epoch_id: number;
        last_epoch_nr_hb: number;
        last_epoch_1st_hb: string;
        last_epoch_last_hb: string;
        last_epoch_avail: number;
    };
    ver: string;
    tags?: string[];
};

type ServerInfo = {
    server_alias: string;
    server_version: string;
    server_time: string;
    server_current_epoch: number;
    server_uptime: string;
};

type Resources = {
    cpu_cores: number;
    cpu_cores_avail: number;
    default_cuda: {
        cpu: number;
        'cuda:0': number;
    };
    disk_avail: number;
    disk_total: number;
    mem_avail: number;
    mem_total: number;
};

type OraclesDefaultResult = {
    result: {
        nodes_total_items: number;
        nodes_total_pages: number;
        nodes_items_per_page: number;
        nodes_page: number;
        nodes: {
            [key: R1Address | string]: NodeState;
        };
        resources_total: Resources;
        query_time: number;
        server_alias: string;
        server_version: string;
        server_time: string;
        server_current_epoch: number;
        server_uptime: string;
        EE_SIGN: string;
        EE_SENDER: R1Address;
        EE_ETH_SENDER: EthAddress;
        EE_ETH_SIGN: string;
        EE_HASH: string;
    };
    server_node_addr: R1Address;
};

type CSP = {
    activeJobsCount: number;
    escrowAddress: EthAddress;
    owner: EthAddress;
    tvl: bigint;
    name?: string; // Added after fetching branding data (if it exists)
};

export type {
    BuyLicenseRequest,
    ComputeParam,
    CSP,
    EthAddress,
    License,
    LicenseInfo,
    NodeLicenseDetailsResponse,
    NodeState,
    OraclesAvailabilityResult,
    OraclesDefaultResult,
    R1Address,
    Resources,
    ServerInfo,
};
