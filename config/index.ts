import { EthAddress } from '@/typedefs/blockchain';
import { addSeconds } from 'date-fns';

export type Config = {
    environment: 'mainnet' | 'testnet' | 'devnet';
    backendUrl: string;
    oraclesUrl: string;
    liquidityManagerContractAddress: EthAddress;
    ndContractAddress: EthAddress;
    mndContractAddress: EthAddress;
    r1ContractAddress: EthAddress;
    readerContractAddress: EthAddress;
    explorerUrl: string;
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

export const getCurrentEpoch = () =>
    Math.floor((Date.now() / 1000 - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const getNextEpochTimestamp = (): Date =>
    addSeconds(config.genesisDate, (getCurrentEpoch() + 1) * config.epochDurationInSeconds);

export const getEpochStartTimestamp = (epoch: number): Date =>
    addSeconds(config.genesisDate, epoch * config.epochDurationInSeconds);

export const getLicenseFirstCheckEpoch = (assignTimestamp: bigint) =>
    Math.floor((Number(assignTimestamp) - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const domains = {
    mainnet: 'explorer.ratio1.ai',
    testnet: 'testnet-explorer.ratio1.ai',
    devnet: 'devnet-explorer.ratio1.ai',
};

// TODO: Remove
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'mainnet' | 'testnet' | 'devnet';

// TODO: Remove
const config: Config = {
    environment,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    oraclesUrl: process.env.NEXT_PUBLIC_ORACLES_URL as string,
    liquidityManagerContractAddress: process.env.NEXT_PUBLIC_LIQUIDITY_MANAGER_CA as EthAddress,
    ndContractAddress: process.env.NEXT_PUBLIC_ND_CA as EthAddress,
    mndContractAddress: process.env.NEXT_PUBLIC_MND_CA as EthAddress,
    r1ContractAddress: process.env.NEXT_PUBLIC_R1_CA as EthAddress,
    readerContractAddress: process.env.NEXT_PUBLIC_READER_CA as EthAddress,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL as string,
    genesisDate: new Date(process.env.NEXT_PUBLIC_GENESIS_DATE as string),
    contractsGenesisBlock: BigInt(process.env.NEXT_PUBLIC_CONTRACTS_GENESIS_BLOCK as string),
    epochDurationInSeconds: Number(process.env.NEXT_PUBLIC_EPOCH_DURATION_SECONDS),
    ndLicenseCap: BigInt(process.env.NEXT_PUBLIC_ND_LICENSE_CAP as string),
    mndCliffEpochs: 120,
    gndVestingEpochs: 365,
    mndVestingEpochs: 900,
    ndVestingEpochs: 1080,
};

export const configs: {
    [key in 'mainnet' | 'testnet' | 'devnet']: Config;
} = {
    mainnet: {
        environment: 'mainnet',
        backendUrl: 'https://dapp-api.ratio1.ai',
        oraclesUrl: 'https://oracle.ratio1.ai',
        liquidityManagerContractAddress: '0x5F4553e231649adD7dfF5e3063357Fd73927e465',
        r1ContractAddress: '0xc992dcab6d3f8783fbf0c935e7bceb20aa50a6f1',
        ndContractAddress: '0xE20198EE2B76eED916A568a47cdea9681f7c79BF',
        mndContractAddress: '0xfD52a7958088dF734D523d618e583e4d53cD7420',
        readerContractAddress: '0xd9a9B7fd2De5fFAF50695d2f489a56771CA28123',
        explorerUrl: 'https://basescan.org',
        genesisDate: new Date('2025-02-05T16:00:00.000Z'),
        contractsGenesisBlock: 26045030n,
        epochDurationInSeconds: 86400,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 120,
        gndVestingEpochs: 365,
        mndVestingEpochs: 900,
        ndVestingEpochs: 1080,
    },
    testnet: {
        environment: 'testnet',
        backendUrl: 'https://testnet-dapp-api.ratio1.ai',
        oraclesUrl: 'https://testnet-oracle.ratio1.ai',
        liquidityManagerContractAddress: '0x5F4553e231649adD7dfF5e3063357Fd73927e465',
        r1ContractAddress: '0xc992dcab6d3f8783fbf0c935e7bceb20aa50a6f1',
        ndContractAddress: '0xE20198EE2B76eED916A568a47cdea9681f7c79BF',
        mndContractAddress: '0xfD52a7958088dF734D523d618e583e4d53cD7420',
        readerContractAddress: '0xDcD3a13208aA23b00a568d00268e0aE4d94216bf',
        explorerUrl: 'https://sepolia.basescan.org',
        genesisDate: new Date('2025-02-05T16:00:00.000Z'),
        contractsGenesisBlock: 21552072n,
        epochDurationInSeconds: 86400,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 120,
        gndVestingEpochs: 365,
        mndVestingEpochs: 900,
        ndVestingEpochs: 1080,
    },
    devnet: {
        environment: 'devnet',
        backendUrl: 'https://devnet-dapp-api.ratio1.ai',
        oraclesUrl: 'https://devnet-oracle.ratio1.ai',
        liquidityManagerContractAddress: '0xE5C61ADEeE7850a8656A10f3963036e5c045B508',
        r1ContractAddress: '0xEF38a3d84D3E3111fb7b794Ba3240187b8B32825',
        ndContractAddress: '0x9f49fc29366F1C8285d42e7E82cA0bb668B32CeA',
        mndContractAddress: '0x909d33Ab74d5A85F1fc963ae63af7B97eAe76f40',
        readerContractAddress: '0xd8f48C730d85E65aE0fBF8B6a8Cc0cdA5D900103',
        explorerUrl: 'https://sepolia.basescan.org',
        genesisDate: new Date('2025-02-12T16:00:00.000Z'),
        contractsGenesisBlock: 21805660n,
        epochDurationInSeconds: 3600,
        ndLicenseCap: 1575188843457943924200n,
        mndCliffEpochs: 120,
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

export default config;
