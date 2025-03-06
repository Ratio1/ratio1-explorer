import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withBundleAnalyzer({
    enabled: false,
})({});

export default nextConfig;
