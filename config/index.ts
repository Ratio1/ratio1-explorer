import { EthAddress } from '@/typedefs/blockchain';
import { addSeconds } from 'date-fns';
import { Config } from './types';

export const projectId = 'b0be1322e97542cc32eb568b37173a1c'; // Ratio1 Explorer

export const getCurrentEpoch = () =>
    Math.floor((Date.now() / 1000 - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const getNextEpochTimestamp = (): Date =>
    addSeconds(config.genesisDate, (getCurrentEpoch() + 1) * config.epochDurationInSeconds);

export const domains = {
    mainnet: 'ratio1-explorer.vercel.app',
    testnet: 'ratio1-testnet-explorer.vercel.app',
    devnet: 'ratio1-devnet-explorer.vercel.app',
};

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'mainnet' | 'testnet' | 'devnet';

const config: Config = {
    environment,
    url: process.env.NEXT_PUBLIC_URL as string,
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    oraclesUrl: process.env.NEXT_PUBLIC_ORACLES_URL as string,
    liquidityManagerContractAddress: process.env.NEXT_PUBLIC_LIQUIDITY_MANAGER_CA as EthAddress,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL as string,
    genesisDate: new Date(process.env.NEXT_PUBLIC_GENESIS_DATE as string),
    epochDurationInSeconds: Number(process.env.NEXT_PUBLIC_EPOCH_DURATION_SECONDS),
    ndLicenseCap: BigInt(process.env.NEXT_PUBLIC_ND_LICENSE_CAP as string),
};

export default config;
