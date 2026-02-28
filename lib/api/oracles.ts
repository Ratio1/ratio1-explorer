'use server';

import config from '@/config';
import { hasNoEpochsFoundError } from '@/lib/oracles';
import * as types from '@/typedefs/blockchain';

const oraclesApiURL = config.oraclesUrl;

export const getNodeLastEpoch = async (nodeEthAddr: types.EthAddress) => {
    return _doGet<types.OraclesAvailabilityResult>(`/node_last_epoch?eth_node_addr=${nodeEthAddr}`, oraclesApiURL);
};

export const getNodeEpochsRange = async (nodeEthAddr: types.EthAddress, startEpoch: number, endEpoch: number) => {
    return _doGet<types.OraclesAvailabilityResult>(
        `/node_epochs_range?eth_node_addr=${nodeEthAddr}&start_epoch=${startEpoch}&end_epoch=${endEpoch}`,
        oraclesApiURL,
    );
};

export const getCurrentEpochServer = async () => {
    return _doGet<types.OraclesAvailabilityResult>('/current_epoch', oraclesApiURL);
};

async function _doGet<T>(endpoint: string, baseUrl: string) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as {
        result: (
            | {
                  error: string;
              }
            | T
        ) &
            types.OraclesDefaultResult;
        node_addr: types.R1Address;
    };

    if (!data.result) {
        throw new Error('Invalid response from oracles API');
    }

    if ('error' in data.result) {
        if (hasNoEpochsFoundError(data.result.error)) {
            return {
                ...data.result,
                epochs: 'epochs' in data.result && Array.isArray(data.result.epochs) ? data.result.epochs : [],
                epochs_vals: 'epochs_vals' in data.result && Array.isArray(data.result.epochs_vals) ? data.result.epochs_vals : [],
            } as T;
        }

        console.log(endpoint, data.result);
        throw new Error(data.result.error);
    }

    return data.result;
}
