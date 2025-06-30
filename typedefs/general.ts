import * as types from '@/typedefs/blockchain';

type LicenseItem = {
    licenseId: number;
    licenseType: 'ND' | 'MND' | 'GND';
};

type SearchResult =
    | { type: 'node'; nodeAddress: types.EthAddress; alias: string; isOnline: boolean }
    | { type: 'license'; licenseId: number; licenseType: 'ND' | 'MND' | 'GND'; nodeAddress: types.EthAddress }
    | { type: 'owner'; address: types.EthAddress; ensName?: string };

export type { LicenseItem, SearchResult };
