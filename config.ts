import { addSeconds } from 'date-fns';
import { EthAddress } from './typedefs/blockchain';

type Config = {
    backendUrl: string;
    oraclesUrl: string;
    r1ContractAddress: EthAddress;
    ndContractAddress: EthAddress;
    mndContractAddress: EthAddress;
    liquidityManagerContractAddress: EthAddress;
    faucetContractAddress?: EthAddress;
    explorerUrl: string;
    genesisDate: Date;
    epochDurationInSeconds: number;
    ND_LICENSE_CAP: bigint;
};

const configs: {
    [key in 'mainnet' | 'testnet']: Config;
} = {
    mainnet: {
        backendUrl: 'https://dapp-api.ratio1.ai',
        oraclesUrl: 'https://oracle-main.ratio1.ai',
        r1ContractAddress: '0xc992DcaB6D3F8783fBf0c935E7bCeB20aa50A6f1',
        ndContractAddress: '0xE20198EE2B76eED916A568a47cdea9681f7c79BF',
        mndContractAddress: '0xfD52a7958088dF734D523d618e583e4d53cD7420',
        liquidityManagerContractAddress: '0xTODO',
        explorerUrl: 'https://basescan.org',
        genesisDate: new Date('2025-02-05T16:00:00.000Z'),
        epochDurationInSeconds: 86400, // 24 hours
        ND_LICENSE_CAP: 1575_188843457943924200n,
    },
    testnet: {
        backendUrl: 'https://dapp-api-test.ratio1.ai',
        oraclesUrl: 'https://oracle-test.ratio1.ai',
        r1ContractAddress: '0xc992dcab6d3f8783fbf0c935e7bceb20aa50a6f1',
        ndContractAddress: '0xE20198EE2B76eED916A568a47cdea9681f7c79BF',
        mndContractAddress: '0xfD52a7958088dF734D523d618e583e4d53cD7420',
        liquidityManagerContractAddress: '0x5F4553e231649adD7dfF5e3063357Fd73927e465',
        explorerUrl: 'https://sepolia.basescan.org',
        genesisDate: new Date('2025-02-05T16:00:00.000Z'),
        epochDurationInSeconds: 86400, // 24 hours
        ND_LICENSE_CAP: 1575_188843457943924200n,
    },
};

const domainMainnet = 'explorer.ratio1.ai';
const domainDevnet = 'devnet-explorer.ratio1.ai';
const domainTestnet = 'testnet-explorer.ratio1.ai';

export const environment = 'testnet';

export const config = configs[environment];

export const projectId = 'b0be1322e97542cc32eb568b37173a1c'; // Explorer

export const getCurrentEpoch = () =>
    Math.floor((Date.now() / 1000 - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const getNextEpochTimestamp = (): Date =>
    addSeconds(config.genesisDate, (getCurrentEpoch() + 1) * config.epochDurationInSeconds);
