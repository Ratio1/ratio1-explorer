import { Config, configs, getEnvironment } from '.';

// Must be called inside hooks in order to ensure the window object is available
export function getClientConfig(): {
    config: Config;
    environment: 'mainnet' | 'testnet' | 'devnet';
} {
    const hostname: string = window.location.hostname;
    const environment: 'mainnet' | 'testnet' | 'devnet' = getEnvironment(hostname);

    return {
        config: configs[environment],
        environment,
    };
}
