'use server';

import { headers } from 'next/headers';

export const getSSURL = async (value: string): Promise<string> => {
    const headersRes = await headers();
    const host = headersRes.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const url = `${protocol}://${host}/api/${value}`;
    return url;
};
