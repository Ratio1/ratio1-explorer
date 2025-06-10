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
        contractsGenesisBlock: 26045030n, // Obsolete, used by fetchR1MintedLastEpoch
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
        contractsGenesisBlock: 21552072n, // Obsolete, used by fetchR1MintedLastEpoch
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
        contractsGenesisBlock: 21805660n, // Obsolete, used by fetchR1MintedLastEpoch
        epochDurationInSeconds: 3600,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 223,
        gndVestingEpochs: 365,
        mndVestingEpochs: 900,
        ndVestingEpochs: 1080,
    },
};

export const getEnvironment = (hostname: string | null): 'mainnet' | 'testnet' | 'devnet' => {
    return hostname === domains.mainnet
        ? ('mainnet' as const)
        : hostname === domains.testnet
          ? ('testnet' as const)
          : ('devnet' as const);
};
