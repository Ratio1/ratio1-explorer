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

type OraclesDefaultResult = {
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

export type { BuyLicenseRequest, ComputeParam, EthAddress, OraclesAvailabilityResult, OraclesDefaultResult, R1Address };
