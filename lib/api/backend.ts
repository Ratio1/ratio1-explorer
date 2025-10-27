import axios from 'axios';
import { unstable_cache } from 'next/cache';
import config from '@/config';

// GET
const getCachedBrandingPlatforms = unstable_cache(
    () => _doGet<string[]>('/branding/get-platforms'),
    ['backend:getBrandingPlatforms'],
    {
        revalidate: 60 * 60 * 24, // 24 hours
        tags: ['branding-platforms'],
    },
);

export const getBrandingPlatforms = async () => getCachedBrandingPlatforms();

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

const backendUrl = config.backendUrl;

const axiosBackend = axios.create({
    baseURL: backendUrl,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosBackend.interceptors.request.use((request) => {
    // Surface when outbound requests are triggered to verify caching behaviour.
    console.log(`[backend] ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
    return request;
});
