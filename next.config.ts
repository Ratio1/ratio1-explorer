import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withBundleAnalyzer({
    enabled: false,
})({
    webpack: (config, { dev }) => {
        if (!dev) {
            // Only apply these settings in production, as they cause hot reloading to break
            config.output.filename = config.output.filename.replace('[chunkhash]', '[contenthash]');
            config.optimization.moduleIds = 'deterministic';
            config.optimization.chunkIds = 'deterministic';
        }
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dapp-api.ratio1.ai',
            },
            {
                protocol: 'https',
                hostname: 'testnet-dapp-api.ratio1.ai',
            },
            {
                protocol: 'https',
                hostname: 'devnet-dapp-api.ratio1.ai',
            },
        ],
    },
    output: 'standalone',
});

export default nextConfig;
