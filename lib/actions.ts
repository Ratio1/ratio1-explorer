'use server';

import { getCurrentEpoch, getLicenseFirstCheckEpoch } from '@/config';
import { getServerConfig } from '@/config/serverConfig';
import * as types from '@/typedefs/blockchain';
import { headers } from 'next/headers';
import { getNodeEpochsRange, getNodeLastEpoch } from './api/oracles';

export const getSSURL = async (value: string): Promise<string> => {
    const headersRes = await headers();
    const host = headersRes.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const url = `${protocol}://${host}/api/${value}`;
    return url;
};

export const getNodeAvailability = async (
    nodeEthAddr: types.EthAddress,
    assignTimestamp: bigint,
): Promise<types.OraclesAvailabilityResult & types.OraclesDefaultResult> => {
    const { config } = await getServerConfig();

    const currentEpoch: number = getCurrentEpoch(config);
    const firstCheckEpoch: number = getLicenseFirstCheckEpoch(config, assignTimestamp);

    return firstCheckEpoch === currentEpoch || firstCheckEpoch === currentEpoch - 1
        ? await getNodeLastEpoch(nodeEthAddr)
        : await getNodeEpochsRange(nodeEthAddr, firstCheckEpoch, currentEpoch - 1);
};
