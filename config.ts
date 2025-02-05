import { addSeconds, differenceInSeconds } from 'date-fns';
import { EthAddress } from './typedefs/blockchain';

export type Config = {
    r1ContractAddress: EthAddress;
    ndContractAddress: EthAddress;
    mndContractAddress: EthAddress;
    liquidityManagerContractAddress: EthAddress;
    safeAddress: EthAddress;
    explorerUrl: string;
    genesisTimestamp: Date;
    epochDurationInSeconds: number;
    mndCliffEpochs: number;
    gndVestingEpochs: number;
    mndVestingEpochs: number;
    ndVestingEpochs: number;
    ndLicenseCap: bigint;
};

export const config = {
    r1ContractAddress: process.env.NEXT_PUBLIC_R1_CONTRACT_ADDRESS as EthAddress,
    ndContractAddress: process.env.NEXT_PUBLIC_ND_CONTRACT_ADDRESS as EthAddress,
    mndContractAddress: process.env.NEXT_PUBLIC_MND_CONTRACT_ADDRESS as EthAddress,
    liquidityManagerContractAddress: process.env.NEXT_PUBLIC_LIQUIDITY_MANAGER_CONTRACT_ADDRESS as EthAddress,
    safeAddress: process.env.NEXT_PUBLIC_SAFE_ADDRESS as EthAddress,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL as string,
    genesisTimestamp: new Date(process.env.NEXT_PUBLIC_GENESIS_DATE as string),
    epochDurationInSeconds: parseInt(process.env.NEXT_PUBLIC_EPOCH_DURATION_SECONDS as string),
    mndCliffEpochs: 120,
    gndVestingEpochs: 365,
    mndVestingEpochs: 900,
    ndVestingEpochs: 1080,
    ndLicenseCap: 15_752n * 10n ** 18n,
};

export const getContractAddress = (type: 'ND' | 'MND' | 'GND') => {
    switch (type) {
        case 'ND':
            return config.ndContractAddress;

        default:
            return config.mndContractAddress;
    }
};

export const getCurrentEpoch = (): number =>
    Math.floor(differenceInSeconds(new Date(), config.genesisTimestamp) / config.epochDurationInSeconds);

export const getNextEpochTimestamp = (): Date =>
    addSeconds(config.genesisTimestamp, (getCurrentEpoch() + 1) * config.epochDurationInSeconds);
