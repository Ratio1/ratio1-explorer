'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';
import axios from 'axios';

const oraclesApiURL = config.oraclesUrl;

export const getNodeLastEpoch = async (nodeEthAddr: types.EthAddress) =>
    _doGet<types.OraclesAvailabilityResult>(`/node_last_epoch?eth_node_addr=${nodeEthAddr}`);

export const getNodeEpochsRange = async (nodeEthAddr: types.EthAddress, startEpoch: number, endEpoch: number) =>
    _doGet<types.OraclesAvailabilityResult>(
        `/node_epochs_range?eth_node_addr=${nodeEthAddr}&start_epoch=${startEpoch}&end_epoch=${endEpoch}`,
    );

export const getCurrentEpoch = async () => _doGet<types.OraclesAvailabilityResult>('/current_epoch');

async function _doGet<T>(endpoint: string) {
    const response = await axiosOracles.get<{
        result: (
            | {
                  error: string;
              }
            | T
        ) &
            types.OraclesDefaultResult;
        node_addr: types.R1Address;
    }>(endpoint);

    const { data } = response;

    if (!data.result) {
        throw new Error('Invalid response from oracles API');
    }

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
