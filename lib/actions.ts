'use server';

import { getCurrentEpoch, getLicenseFirstCheckEpoch } from '@/config';
import * as types from '@/typedefs/blockchain';
import { SearchResult } from '@/typedefs/general';
import { headers } from 'next/headers';
import { getActiveNodes } from './api';
import { getLicense } from './api/blockchain';
import { getNodeEpochsRange, getNodeLastEpoch } from './api/oracles';
import { cachedGetENSName, internalNodeAddressToEthAddress, isNonZeroInteger, isZeroAddress } from './utils';

const URL_SAFE_PATTERN = /^[a-zA-Z0-9x\s\-_\.]+$/;

export const getSSURL = async (value: string): Promise<string> => {
    const headersRes = await headers();
    const host = headersRes.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const url = `${protocol}://${host}/api/${value}`;
    return url;
};

export const getNodeAvailability = async (
    nodeEthAddr: types.EthAddress,
    assignTimestamp: bigint,
): Promise<types.OraclesAvailabilityResult & types.OraclesDefaultResult> => {
    const currentEpoch: number = getCurrentEpoch();
    const firstCheckEpoch: number = getLicenseFirstCheckEpoch(assignTimestamp);

    // If the license was linked in the current or previous epoch
    return currentEpoch - firstCheckEpoch <= 1
        ? await getNodeLastEpoch(nodeEthAddr)
        : await getNodeEpochsRange(nodeEthAddr, firstCheckEpoch, currentEpoch - 1);
};

export const search = async (
    query: string,
): Promise<{
    results: SearchResult[];
    error: boolean;
}> => {
    query = query.trim();

    if (!query) {
        console.log('Empty search query.');
        return {
            results: [],
            error: false,
        };
    }

    if (query.length > 50 || !URL_SAFE_PATTERN.test(query)) {
        console.log('Search query is invalid.');
        return {
            results: [],
            error: true,
        };
    }

    try {
        const resultsArray: SearchResult[] = [];
        let ethAddress: types.EthAddress | null = null;
        const isInternalAddress = query.startsWith('0xai_') && query.length === 49;

        if (isInternalAddress) {
            ethAddress = internalNodeAddressToEthAddress(query) as types.EthAddress;
            console.log('Converted Internal Address to ETH Address', ethAddress);
        } else if (/^0x(?!_ai)/.test(query) && query.length === 42) {
            ethAddress = query as types.EthAddress;
        }

        if (ethAddress) {
            console.log('Searching for ETH address...');

            if (!isInternalAddress) {
                const ensName = await cachedGetENSName(ethAddress);

                resultsArray.push({
                    type: 'owner',
                    address: ethAddress,
                    ensName,
                });
            }

            try {
                const nodeResponse = await getNodeLastEpoch(ethAddress);

                resultsArray.push({
                    type: 'node',
                    nodeAddress: nodeResponse.node_eth_address,
                    alias: nodeResponse.node_alias,
                    isOnline: nodeResponse.node_is_online,
                });

                return {
                    results: resultsArray,
                    error: false,
                };
            } catch (error) {
                console.log('Address is not a valid node.');
            } finally {
                return {
                    results: resultsArray,
                    error: isInternalAddress ? resultsArray.length === 0 : false,
                };
            }
        } else if (isNonZeroInteger(query)) {
            console.log('Searching for license...');
            const licenseId = parseInt(query);

            try {
                const ndLicense = await getLicense('ND', licenseId);
                if (ndLicense && !isZeroAddress(ndLicense.nodeAddress)) {
                    resultsArray.push({
                        type: 'license',
                        licenseId,
                        licenseType: 'ND',
                        nodeAddress: ndLicense.nodeAddress,
                    });
                }
            } catch (error) {
                console.log('ND License not found', licenseId);
            }

            try {
                const mndLicense = await getLicense('MND', licenseId);
                if (!isZeroAddress(mndLicense.nodeAddress)) {
                    resultsArray.push({
                        type: 'license',
                        licenseId,
                        licenseType: licenseId === 1 ? 'GND' : 'MND',
                        nodeAddress: mndLicense.nodeAddress,
                    });
                }
            } catch (error) {
                console.log('MND/GND License not found', licenseId);
            }

            return {
                results: resultsArray,
                error: resultsArray.length === 0,
            };
        } else {
            console.log('Searching for nodes by alias...');
            let response: types.OraclesDefaultResult;

            try {
                response = await getActiveNodes(1, 50, query);
                console.log('[Search] getActiveNodes', response);

                if (response.result.nodes) {
                    Object.entries(response.result.nodes).forEach(([_ratio1Addr, node]) => {
                        resultsArray.push({
                            type: 'node',
                            nodeAddress: node.eth_addr,
                            alias: node.alias,
                            isOnline: parseInt(node.last_seen_ago.split(':')[2]) < 60,
                        });
                    });

                    // Sort results by node alias
                    resultsArray.sort((a, b) => {
                        if (a.type === 'node' && b.type === 'node') {
                            return a.alias.localeCompare(b.alias);
                        }
                        return 0;
                    });

                    return {
                        results: resultsArray,
                        error: resultsArray.length === 0,
                    };
                } else {
                    throw new Error('No nodes found for the current query.');
                }
            } catch (error) {
                return {
                    results: [],
                    error: true,
                };
            }
        }
    } catch (error) {
        console.log(error);
        return {
            results: [],
            error: true,
        };
    }
};

export const layoutDataFunction = async () => {
    return await getActiveNodes(1);
};
