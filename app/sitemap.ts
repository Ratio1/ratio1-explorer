import config from '@/config';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return [
        {
            url: config.publicUrl,
            lastModified: new Date().toISOString(),
        },
    ];
}
