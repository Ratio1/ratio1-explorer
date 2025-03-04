'use client';

import { HeroUIProvider } from '@heroui/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

const wagmiConfig = createConfig({
    chains: [baseSepolia],
    ssr: true,
    transports: {
        [baseSepolia.id]: http(),
    },
});

export function Wrappers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <HeroUIProvider>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </WagmiProvider>
        </HeroUIProvider>
    );
}
