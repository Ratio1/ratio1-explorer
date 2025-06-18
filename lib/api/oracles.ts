'use server';

import config from '@/config';
import * as types from '@/typedefs/blockchain';
import axios, { AxiosInstance } from 'axios';

const axiosInstances: Map<string, AxiosInstance> = new Map();

export async function getAxiosBackend(baseURL: string): Promise<AxiosInstance> {
    if (!axiosInstances.has(baseURL)) {
        const instance = axios.create({
            baseURL,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        instance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                return error.response;
            },
        );

        axiosInstances.set(baseURL, instance);
    }

    return axiosInstances.get(baseURL)!;
}

export const getNodeLastEpoch = async (nodeEthAddr: types.EthAddress) => {
    const oraclesApiURL = config.oraclesUrl;

    return _doGet<types.OraclesAvailabilityResult>(`/node_last_epoch?eth_node_addr=${nodeEthAddr}`, oraclesApiURL);
};

export const getNodeEpochsRange = async (nodeEthAddr: types.EthAddress, startEpoch: number, endEpoch: number) => {
    const oraclesApiURL = config.oraclesUrl;

    return _doGet<types.OraclesAvailabilityResult>(
        `/node_epochs_range?eth_node_addr=${nodeEthAddr}&start_epoch=${startEpoch}&end_epoch=${endEpoch}`,
        oraclesApiURL,
    );
};

export const getCurrentEpochServer = async () => {
    const oraclesApiURL = config.oraclesUrl;

    return _doGet<types.OraclesAvailabilityResult>('/current_epoch', oraclesApiURL);
};

async function _doGet<T>(endpoint: string, baseUrl: string) {
    const axiosOracles = await getAxiosBackend(baseUrl);

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
