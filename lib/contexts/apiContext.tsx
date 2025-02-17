import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import { ping } from '../api/backend';

export interface ApiContextType {
    pingData:
        | {
              status: string;
          }
        | undefined;
    pingError: Error | null;
    isPingLoading: boolean;
}

const ApiContext = createContext<ApiContextType | null>(null);

export const useApiContext = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
    const {
        data: pingData,
        error: pingError,
        isLoading: isPingLoading,
    } = useQuery({
        queryKey: ['ping'],
        queryFn: ping,
        retry: false,
    });

    return (
        <ApiContext.Provider
            value={{
                pingData,
                pingError,
                isPingLoading,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};
