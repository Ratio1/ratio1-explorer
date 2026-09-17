import * as types from '@/typedefs/blockchain';

type LicenseItem = {
    licenseId: number;
    licenseType: 'ND' | 'MND' | 'GND';
};

type LicenseListItem = LicenseItem & {
    owner: types.EthAddress;
    nodeAddress: types.EthAddress;
    totalAssignedAmount: string;
    totalClaimedAmount: string;
    assignTimestamp: string;
    awbBalance: string;
    isBanned: boolean;
};

type NodeSearchResources = Pick<types.Resources, 'cpu_cores' | 'cpu_cores_avail' | 'mem_avail' | 'mem_total'>;

type SearchResult =
    | {
          type: 'node';
          nodeAddress: types.EthAddress;
          internalAddress?: types.R1Address;
          alias: string;
          isOnline: boolean;
          tags?: string[];
          resources?: NodeSearchResources;
      }
    | { type: 'license'; licenseId: number; licenseType: 'ND' | 'MND' | 'GND'; nodeAddress: types.EthAddress }
    | { type: 'owner'; address: types.EthAddress; ensName?: string };

type TokenSupplyResponse = {
    burned: number;
    circulatingSupply: number;
    initialMinted: number;
    maxSupply: number;
    minted: number;
    nodeAddress: types.EthAddress;
    totalSupply: number;
};

type TokenStatsEntry = {
    creationTimestamp: string;
    dailyActiveJobs: number;
    dailyMinted: number;
    dailyNdContractTokenBurn: number;
    dailyPOAIRewards: number;
    dailyPoaiTokenBurn: number;
    dailyTokenBurn: number;
    dailyUsdcLocked: number;
    lastBlockNumber: number;
    teamWalletsSupply: number;
    totalMinted: number;
    totalNdContractTokenBurn: number;
    totalPOAIRewards: number;
    totalSupply: number;
    totalTokenBurn: number;
};

type TokenStatsResponse = {
    data: TokenStatsEntry[];
    error: string;
    nodeAddress: types.EthAddress;
};

type PublicProfileInfo = {
    brandAddress: types.EthAddress;
    name: string;
    description: string;
    links: Record<string, string>;
};

export type {
    LicenseItem,
    LicenseListItem,
    NodeSearchResources,
    PublicProfileInfo,
    SearchResult,
    TokenStatsEntry,
    TokenStatsResponse,
    TokenSupplyResponse,
};
