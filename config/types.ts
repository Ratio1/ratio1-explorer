import { EthAddress } from '@/typedefs/blockchain';

export type Config = {
    networkName: string;
    backendUrl: string;
    oraclesUrl: string;
    liquidityManagerContractAddress: EthAddress;
    explorerUrl: string;
    genesisDate: Date;
    epochDurationInSeconds: number;
    ndLicenseCap: bigint;
};
