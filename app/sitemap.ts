import { getHostUrl } from '@/lib/utils';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: getHostUrl(),
            lastModified: new Date().toISOString(),
        },
    ];
}
