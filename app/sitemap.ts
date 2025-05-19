import { getServerURL } from '@/config/serverConfig';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const url = await getServerURL();

    return [
        {
            url,
            lastModified: new Date().toISOString(),
        },
    ];
}
