'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';
import axios from 'axios';

const oraclesApiURL = config.oraclesUrl;

export const getActiveNodes = async (): Promise<types.OraclesDefaultResult> => {
    const response: Response = await fetch(`${oraclesApiURL}/active_nodes_list`);

    if (!response.ok) {
        throw new Error('Failed to fetch data.');
    }

    return response.json();
};

export const getNodeLastEpoch = async (nodeEthAddr: types.EthAddress) =>
    _doGet<types.OraclesAvailabilityResult>(`/node_last_epoch?eth_node_addr=${nodeEthAddr}`);

export const getCurrentEpoch = async () => _doGet<types.OraclesAvailabilityResult>('/current_epoch');

async function _doGet<T>(endpoint: string) {
    const { data } = await axiosOracles.get<{
        result: (
            | {
                  error: string;
              }
            | T
        ) &
            types.OraclesDefaultResult;
        node_addr: types.R1Address;
    }>(endpoint);

    if ('error' in data.result) {
        throw new Error(data.result.error);
    }

    return data.result;
}

const axiosOracles = axios.create({
    baseURL: oraclesApiURL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosOracles.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        return error.response;
    },
);
