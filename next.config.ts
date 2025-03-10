import withBundleAnalyzer from '@next/bundle-analyzer';
import { execSync } from 'child_process';
import type { NextConfig } from 'next';

let gitVersion = 'unknown';
try {
    gitVersion = execSync('git describe --tags --abbrev=0').toString().trim();
} catch (error) {
    console.warn('Failed to get git version:', error);
}

const nextConfig: NextConfig = withBundleAnalyzer({
    enabled: false,
})({
    generateBuildId: async () => {
        return 'ratio1-explorer';
    },
    webpack: (config, { dev }) => {
        if (!dev) {
            // Only apply these settings in production
            config.output.filename = config.output.filename.replace('[chunkhash]', '[contenthash]');
            config.optimization.moduleIds = 'deterministic';
            config.optimization.chunkIds = 'deterministic';
        }
        return config;
    },
    output: 'standalone',
    env: {
        NEXT_PUBLIC_APP_VERSION: gitVersion,
    },
});

export default nextConfig;
