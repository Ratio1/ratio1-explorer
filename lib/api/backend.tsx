'use server';

import config from '@/config';
import axios from 'axios';

const backendUrl = config.backendUrl;

export const ping = async () => _doGet<any>('/auth/nodeData');

// Hepers
async function _doGet<T>(endpoint: string) {
    const { data } = await axiosBackend.get<{
        data: T;
        error: string;
    }>(endpoint);
    if (data.error) {
        throw new Error(data.error);
    }
    return data.data;
}

const axiosBackend = axios.create({
    baseURL: backendUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
