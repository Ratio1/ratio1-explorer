import { EthAddress } from '@/typedefs/blockchain';
import { addSeconds } from 'date-fns';
import { base, baseSepolia } from 'viem/chains';

export type Config = {
    environment: 'mainnet' | 'testnet' | 'devnet';
    backendUrl: string;
    oraclesUrl: string;
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

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'mainnet' | 'testnet' | 'devnet';

export const chain = environment === 'mainnet' ? base : baseSepolia;

const config: Config = {
    environment,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    oraclesUrl: process.env.NEXT_PUBLIC_ORACLES_URL as string,
    ndContractAddress: process.env.NEXT_PUBLIC_ND_CA as EthAddress,
    mndContractAddress: process.env.NEXT_PUBLIC_MND_CA as EthAddress,
    r1ContractAddress: process.env.NEXT_PUBLIC_R1_CA as EthAddress,
    readerContractAddress: process.env.NEXT_PUBLIC_READER_CA as EthAddress,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL as string,
    genesisDate: new Date(process.env.NEXT_PUBLIC_GENESIS_DATE as string),
    contractsGenesisBlock: BigInt(process.env.NEXT_PUBLIC_CONTRACTS_GENESIS_BLOCK as string),
    epochDurationInSeconds: Number(process.env.NEXT_PUBLIC_EPOCH_DURATION_SECONDS),
    ndLicenseCap: BigInt(process.env.NEXT_PUBLIC_ND_LICENSE_CAP as string),
    mndCliffEpochs: 223,
    gndVestingEpochs: 365,
    mndVestingEpochs: 900,
    ndVestingEpochs: 1080,
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

export default config;
