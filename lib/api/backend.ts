import config from '@/config';
import { EthAddress } from '@/typedefs/blockchain';
import { PublicProfileInfo } from '@/typedefs/general';
import axios from 'axios';
import { unstable_cache } from 'next/cache';

// CACHED
const getCachedBrandingPlatforms = unstable_cache(
    () => _doGet<string[]>('/branding/get-platforms'),
    ['backend:getBrandingPlatforms'],
    {
        revalidate: 60 * 60 * 24, // 24 hours
        tags: ['branding-platforms'],
    },
);

// GET
export const getBrandingPlatforms = async () => getCachedBrandingPlatforms();

export const pingBackend = async () => {
    try {
        const response = await fetch(`${backendUrl}/auth/nodeData`);
        return response.ok;
    } catch {
        return false;
    }
};

// POST
export const getPublicProfiles = async (addresses: EthAddress[]) =>
    _doPost<{
        brands: Array<PublicProfileInfo>;
    }>('/branding/get-brands', { brandAddresses: addresses });

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

async function _doPost<T>(endpoint: string, body: any, headers?: Record<string, string>) {
    const { data } = await axiosBackend.post<{
        data: T;
        error: string;
    }>(endpoint, body, {
        headers,
    });

    if (data.error) {
        throw new Error(data.error);
    }

    return data.data;
}

const backendUrl = config.backendUrl;

const axiosBackend = axios.create({
    baseURL: backendUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosBackend.interceptors.request.use((request) => {
    // console.log(`[backend] ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
    return request;
});
