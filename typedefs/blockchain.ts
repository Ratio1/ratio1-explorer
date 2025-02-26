type R1Address = `0xai${string}`;
type EthAddress = `0x${string}`;

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
};

type ServerInfo = {
    server_alias: string;
    server_version: string;
    server_time: string;
    server_current_epoch: number;
    server_uptime: string;
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

export type {
    BuyLicenseRequest,
    ComputeParam,
    EthAddress,
    NodeState,
    OraclesAvailabilityResult,
    OraclesDefaultResult,
    R1Address,
    ServerInfo,
};
