import { EthAddress } from '@/typedefs/blockchain';
import { Config } from './types';

const mainnetConfig: Config = {
    networkName: 'Mainnet',
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    oraclesUrl: process.env.NEXT_PUBLIC_ORACLES_URL as string,
    liquidityManagerContractAddress: process.env.NEXT_PUBLIC_LIQUIDITY_MANAGER_CA as EthAddress,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL as string,
    genesisDate: new Date(process.env.NEXT_PUBLIC_GENESIS_DATE as string),
    epochDurationInSeconds: Number(process.env.NEXT_PUBLIC_EPOCH_DURATION_SECONDS),
    ndLicenseCap: BigInt(process.env.NEXT_PUBLIC_ND_LICENSE_CAP as string),
};

export default mainnetConfig;
