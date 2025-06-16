import { EthAddress } from '@/typedefs/blockchain';
import { addSeconds } from 'date-fns';

export type Config = {
    environment: 'mainnet' | 'testnet' | 'devnet';
    backendUrl: string;
    oraclesUrl: string;
    ndContractAddress: EthAddress;
    mndContractAddress: EthAddress;
    r1ContractAddress: EthAddress;
    readerContractAddress: EthAddress;
    genesisDate: Date;
    contractsGenesisBlock: bigint;
    epochDurationInSeconds: number;
    ndLicenseCap: bigint;
    mndCliffEpochs: number;
    gndVestingEpochs: number;
    mndVestingEpochs: number;
    ndVestingEpochs: number;
};

export const projectId = 'b0be1322e97542cc32eb568b37173a1c'; // Ratio1 Explorer

export const getCurrentEpoch = (config: Config) =>
    Math.floor((Date.now() / 1000 - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const getNextEpochTimestamp = (config: Config): Date =>
    addSeconds(config.genesisDate, (getCurrentEpoch(config) + 1) * config.epochDurationInSeconds);

export const getEpochStartTimestamp = (config: Config, epoch: number): Date =>
    addSeconds(config.genesisDate, epoch * config.epochDurationInSeconds);

export const getLicenseFirstCheckEpoch = (config: Config, assignTimestamp: bigint) =>
    Math.floor((Number(assignTimestamp) - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const domains = {
    mainnet: 'explorer.ratio1.ai',
    testnet: 'testnet-explorer.ratio1.ai',
    devnet: 'devnet-explorer.ratio1.ai',
};

export const configs: {
    [key in 'mainnet' | 'testnet' | 'devnet']: Config;
} = {
    mainnet: {
        environment: 'mainnet',
        backendUrl: 'https://dapp-api.ratio1.ai',
        oraclesUrl: 'https://oracle.ratio1.ai',
        r1ContractAddress: '0x6444C6c2D527D85EA97032da9A7504d6d1448ecF',
        ndContractAddress: '0xE658DF6dA3FB5d4FBa562F1D5934bd0F9c6bd423',
        mndContractAddress: '0x0C431e546371C87354714Fcc1a13365391A549E2',
        readerContractAddress: '0xa2fDD4c7E93790Ff68a01f01AA789D619F12c6AC',
        genesisDate: new Date('2025-05-23T16:00:00.000Z'),
        contractsGenesisBlock: 30613326n,
        epochDurationInSeconds: 86400,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 223,
        gndVestingEpochs: 365,
        mndVestingEpochs: 900,
        ndVestingEpochs: 1080,
    },
    testnet: {
        environment: 'testnet',
        backendUrl: 'https://testnet-dapp-api.ratio1.ai',
        oraclesUrl: 'https://testnet-oracle.ratio1.ai',
        r1ContractAddress: '0xCC96f389F45Fc08b4fa8e2bC4C7DA9920292ec64',
        ndContractAddress: '0x18E86a5829CA1F02226FA123f30d90dCd7cFd0ED',
        mndContractAddress: '0xa8d7FFCE91a888872A9f5431B4Dd6c0c135055c1',
        readerContractAddress: '0xd1c7Dca934B37FAA402EB2EC64F6644d6957bE3b',
        genesisDate: new Date('2025-05-23T16:00:00.000Z'),
        contractsGenesisBlock: 26123856n,
        epochDurationInSeconds: 86400,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 223,
        gndVestingEpochs: 365,
        mndVestingEpochs: 900,
        ndVestingEpochs: 1080,
    },
    devnet: {
        environment: 'devnet',
        backendUrl: 'https://devnet-dapp-api.ratio1.ai',
        oraclesUrl: 'https://devnet-oracle.ratio1.ai',
        r1ContractAddress: '0x07C5678F0f4aC347496eAA8D6031b37FF3402CE5',
        ndContractAddress: '0x8D0CE4933728FF7C04388f0bEcC9a45676E232F7',
        mndContractAddress: '0x7A14Be75135a7ebdef99339CCc700C25Cda60c6E',
        readerContractAddress: '0x2c62a818967D3396b535De3d1EC47aF1f2B1282D',
        genesisDate: new Date('2025-05-23T16:00:00.000Z'),
        contractsGenesisBlock: 26123856n,
        epochDurationInSeconds: 3600,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 223,
        gndVestingEpochs: 365,
        mndVestingEpochs: 900,
        ndVestingEpochs: 1080,
    },
};

export const treasuryWallets: {
    address: EthAddress;
    name: string;
    percentage: number;
}[] = [
    {
        address: '0xABdaAC00E36007fB71b2059fc0E784690a991923',
        name: 'LP',
        percentage: 26.71,
    },
    {
        address: '0x5d5F16f1848c87b49185A9136cdF042384e82BA8',
        name: 'Expenses',
        percentage: 13.84,
    },
    {
        address: '0x9a7055e3FBA00F5D5231994B97f1c0216eE1C091',
        name: 'Marketing',
        percentage: 7.54,
    },
    {
        address: '0x745C01f91c59000E39585441a3F1900AeF72c5C1',
        name: 'Grants',
        percentage: 34.6,
    },
    {
        address: '0x0A27F805Db42089d79B96A4133A93B2e5Ff1b28C',
        name: 'CSR',
        percentage: 17.31,
    },
];

export const getEnvironment = (hostname: string | null): 'mainnet' | 'testnet' | 'devnet' => {
    return hostname === domains.mainnet
        ? ('mainnet' as const)
        : hostname === domains.testnet
          ? ('testnet' as const)
          : ('mainnet' as const);
};
