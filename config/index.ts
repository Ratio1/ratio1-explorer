import { addSeconds } from 'date-fns';
import mainnetConfig from './mainnet';
import testnetConfig from './testnet';
import { Config } from './types';

export const projectId = 'b0be1322e97542cc32eb568b37173a1c'; // Ratio1 Explorer

export const getCurrentEpoch = () =>
    Math.floor((Date.now() / 1000 - config.genesisDate.getTime() / 1000) / config.epochDurationInSeconds);

export const getNextEpochTimestamp = (): Date =>
    addSeconds(config.genesisDate, (getCurrentEpoch() + 1) * config.epochDurationInSeconds);

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

// TODO: Use the config here directly and only adjust the network name
const config: Config = environment === 'mainnet' ? mainnetConfig : testnetConfig;

export default config;
