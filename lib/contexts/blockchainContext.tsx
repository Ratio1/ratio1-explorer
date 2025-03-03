import { ERC20Abi } from '@/blockchain/ERC20';
import { LiquidityManagerAbi } from '@/blockchain/LiquidityManager';
import config from '@/config';
import { createContext, useContext, useState } from 'react';
import { usePublicClient } from 'wagmi';

export interface BlockchainContextType {
    // R1 Price
    r1Price: bigint;
    fetchR1Price: () => void;
    // R1 Total supply
    R1TotalSupply: bigint | undefined;
    fetchR1TotalSupply: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | null>(null);

export const useBlockchainContext = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [r1Price, setR1Price] = useState<bigint>(0n);
    const [R1TotalSupply, setR1TotalSupply] = useState<bigint>();

    const publicClient = usePublicClient();

    const fetchR1Price = async () => {
        if (publicClient && config.liquidityManagerContractAddress.length === 42) {
            const price = await publicClient.readContract({
                address: config.liquidityManagerContractAddress,
                abi: LiquidityManagerAbi,
                functionName: 'getTokenPrice',
            });

            setR1Price(price);
        }
    };

    const fetchR1TotalSupply = async () => {
        if (!publicClient) {
            return;
        }

        try {
            const totalSupply = await publicClient.readContract({
                address: config.r1ContractAddress,
                abi: ERC20Abi,
                functionName: 'totalSupply',
            });
            setR1TotalSupply(totalSupply);
        } catch (error) {
            console.error('Error fetching R1 total supply');
        }
    };

    return (
        <BlockchainContext.Provider
            value={{
                // R1 Price
                r1Price,
                fetchR1Price,
                // R1 Total supply
                R1TotalSupply,
                fetchR1TotalSupply,
            }}
        >
            {children}
        </BlockchainContext.Provider>
    );
};
