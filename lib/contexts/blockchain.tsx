import { LiquidityManagerAbi } from '@/blockchain/LiquidityManager';
import { config } from '@/config';
import { createContext, useContext, useState } from 'react';
import { usePublicClient } from 'wagmi';

export interface BlockchainContextType {
    // R1 Price
    r1Price: bigint;
    fetchR1Price: () => void;
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [r1Price, setR1Price] = useState<bigint>(0n);

    const publicClient = usePublicClient();

    const fetchR1Price = async () => {
        if (publicClient) {
            const price = await publicClient.readContract({
                address: config.liquidityManagerContractAddress,
                abi: LiquidityManagerAbi,
                functionName: 'getTokenPrice',
            });

            setR1Price(price);
        }
    };

    return (
        <BlockchainContext.Provider
            value={{
                // R1 Price
                r1Price,
                fetchR1Price,
            }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};
