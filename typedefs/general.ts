import * as types from '@/typedefs/blockchain';

type LicenseItem = {
    licenseId: number;
    licenseType: 'ND' | 'MND' | 'GND';
};

type SearchResult =
    | { type: 'node'; nodeAddress: types.EthAddress; alias: string; isOnline: boolean }
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

export type { LicenseItem, SearchResult, TokenStatsEntry, TokenStatsResponse, TokenSupplyResponse };
