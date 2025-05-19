import { getServerURL } from '@/config/serverConfig';
import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const url = await getServerURL();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${url}/sitemap.xml`,
    };
}
