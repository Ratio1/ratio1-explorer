import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = withBundleAnalyzer({
    enabled: false,
})({
    generateBuildId: async () => {
        return 'ratio1-explorer';
    },
    webpack: (config) => {
        config.output.filename = config.output.filename.replace('[chunkhash]', '[contenthash]');
        config.optimization.moduleIds = 'deterministic';
        config.optimization.chunkIds = 'deterministic';
        return config;
    },
    output: "standalone"
});

export default nextConfig;
