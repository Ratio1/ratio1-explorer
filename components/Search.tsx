'use client';

import { Alert } from '@/app/server-components/shared/Alert';
import { getActiveNodes } from '@/lib/api';
import { getLicense } from '@/lib/api/blockchain';
import { getNodeLastEpoch } from '@/lib/api/oracles';
import { routePath } from '@/lib/routes';
import useDebounce from '@/lib/useDebounce';
import { cachedGetENSName, isEmptyETHAddr, isNonZeroInteger } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Input } from '@heroui/input';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import clsx from 'clsx';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { RiErrorWarningLine, RiLightbulbLine, RiSearchLine } from 'react-icons/ri';
import { CopyableAddress } from './shared/CopyableValue';
import Identicon from './shared/Identicon';

type SearchResult =
    | { type: 'node'; nodeAddress: types.EthAddress; alias: string; isOnline: boolean }
    | { type: 'license'; licenseId: number; licenseType: 'ND' | 'MND' | 'GND'; nodeAddress: types.EthAddress }
    | { type: 'owner'; address: types.EthAddress; ensName?: string };

const URL_SAFE_PATTERN = /^[a-zA-Z0-9x\s\-_\.]+$/;

export default function Search() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);

    const [value, setValue] = useState<string>('');
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [results, setResults] = useState<SearchResult[]>([]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === '/') {
            event.preventDefault();
            onOpen();
        }

        if (event.key === 'Escape') {
            onClose();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const onSearch = async (query: string) => {
        query = query.trim();

        if (!query || query.length > 42 || !URL_SAFE_PATTERN.test(query)) {
            console.log('Search query is invalid');
            displayError();
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const resultsArray: SearchResult[] = [];

            if (query.startsWith('0x') && query.length === 42) {
                const ethAddress = query as types.EthAddress;
                const ensName = await cachedGetENSName(ethAddress);

                resultsArray.push({
                    type: 'owner',
                    address: ethAddress,
                    ensName,
                });

                try {
                    const nodeResponse = await getNodeLastEpoch(ethAddress);
                    console.log('Search node', nodeResponse);

                    resultsArray.push({
                        type: 'node',
                        nodeAddress: nodeResponse.node_eth_address,
                        alias: nodeResponse.node_alias,
                        isOnline: nodeResponse.node_is_online,
                    });
                } catch (error) {
                    console.log('Address is not a valid node');
                } finally {
                    setResults(resultsArray);
                    setError(false);
                }
            } else if (isNonZeroInteger(query)) {
                const licenseId = parseInt(query);

                try {
                    const ndLicense = await getLicense('ND', licenseId);
                    if (ndLicense && !isEmptyETHAddr(ndLicense.nodeAddress)) {
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
                    if (!isEmptyETHAddr(mndLicense.nodeAddress)) {
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

                setResults(resultsArray);
                setError(resultsArray.length === 0);
            } else {
                let response: types.OraclesDefaultResult;

                try {
                    response = await getActiveNodes(1, query);

                    if (response.result.nodes) {
                        Object.entries(response.result.nodes).forEach(([_ratio1Addr, node]) => {
                            resultsArray.push({
                                type: 'node',
                                nodeAddress: node.eth_addr,
                                alias: node.alias,
                                isOnline: parseInt(node.last_seen_ago.split(':')[2]) < 60,
                            });
                        });

                        setResults(resultsArray);
                    } else {
                        displayError();
                    }
                } catch (error) {
                    displayError();
                }
            }
        } catch (error) {
            console.log(error);
            displayError();
        } finally {
            setLoading(false);
        }
    };

    const displayError = () => {
        setResults([]);
        setError(true);
    };

    useDebounce(
        () => {
            onSearch(value);
        },
        [value],
        400,
    );

    const getAlert = () => {
        if (!value || !isError) {
            return (
                <Alert
                    icon={<RiLightbulbLine className="text-lg" />}
                    title="Search"
                    description="Start writing to search for Nodes or owners using an ETH address or for Licenses using IDs."
                />
            );
        }

        if (isError) {
            return (
                <Alert
                    variant="warning"
                    icon={<RiErrorWarningLine className="text-lg" />}
                    title="No results"
                    description="We couldn't find any results matching your search. Try again with a different value."
                />
            );
        }
    };

    const getSectionTitle = (value: string) => <div className="-mb-1 text-sm font-medium text-slate-500">{value}</div>;

    return (
        <>
            <div className="w-full lg:max-w-lg">
                <div
                    className="row group h-[52px] w-full cursor-pointer justify-between rounded-xl border-2 border-slate-100 px-4 transition-all hover:border-slate-200"
                    onClick={onOpen}
                >
                    <div className="row gap-2.5">
                        <RiSearchLine className="text-xl text-slate-400 transition-all group-hover:text-primary" />
                        <div className="text-[15px] text-slate-400">Search the Ratio1 ecosystem</div>
                    </div>

                    <div className="center-all h-7 w-7 rounded-lg bg-primary-50 font-medium text-primary">/</div>
                </div>
            </div>

            <Modal
                className="max-w-[524px]"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                shouldBlockScroll={false}
                placement="top"
                hideCloseButton
            >
                <ModalContent>
                    <div className="col gap-4 p-4">
                        <Input
                            isClearable
                            autoFocus
                            value={value}
                            onValueChange={(value) => {
                                setValue(value);
                            }}
                            size="lg"
                            classNames={{
                                base: 'group-data-[hover=true]:border-slate-200',
                                inputWrapper:
                                    'h-[52px] group-data-[hover=true]:border-slate-200 border-slate-100 group-data-[focus=true]:!border-primary px-4 rounded-xl shadow-none',
                                input: '!pl-2.5 text-[15px] !pr-6',
                            }}
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Search the Ratio1 ecosystem"
                            startContent={<RiSearchLine className="text-xl text-slate-400" />}
                            endContent={
                                isLoading ? (
                                    <div className="center-all bg-white">
                                        <Spinner size="sm" />
                                    </div>
                                ) : null
                            }
                            maxLength={42}
                        />

                        {!results.length ? (
                            getAlert()
                        ) : (
                            <div className="col gap-4">
                                {results.some((r) => r.type === 'node') && (
                                    <div className="col gap-2">
                                        {getSectionTitle('Nodes')}

                                        {results
                                            .filter((r): r is Extract<SearchResult, { type: 'node' }> => r.type === 'node')
                                            .map((node, index) => (
                                                <div key={index}>
                                                    <Link
                                                        href={`${routePath.node}/${node.nodeAddress}`}
                                                        className="row -mx-4 cursor-pointer px-4 py-2.5 transition-all hover:bg-slate-50"
                                                        onClick={onClose}
                                                    >
                                                        <div className="row gap-3">
                                                            <div className="relative h-8 w-8">
                                                                <Identicon value={`node_${node.nodeAddress}`} />

                                                                <div
                                                                    className={clsx(
                                                                        'absolute right-0 top-0 z-10 -mr-1 -mt-1 h-4 w-4 rounded-full border-2 border-white',
                                                                        {
                                                                            'bg-teal-500': node?.isOnline,
                                                                            'bg-red-500': !node?.isOnline,
                                                                        },
                                                                    )}
                                                                ></div>
                                                            </div>

                                                            <div className="col">
                                                                <div className="text-sm font-medium">{node.alias}</div>
                                                                <CopyableAddress value={node.nodeAddress} size={8} />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {results.some((r) => r.type === 'license') && (
                                    <div className="col gap-2">
                                        {getSectionTitle('Licenses')}

                                        {results
                                            .filter(
                                                (r): r is Extract<SearchResult, { type: 'license' }> => r.type === 'license',
                                            )
                                            .map((license, index) => (
                                                <div key={index}>
                                                    <Link
                                                        href={`${routePath.license}/${license.licenseType}/${license.licenseId}`}
                                                        className="row -mx-4 cursor-pointer px-4 py-2.5 transition-all hover:bg-slate-50"
                                                        onClick={onClose}
                                                    >
                                                        <div className="row gap-3">
                                                            <div className="relative h-8 w-8">
                                                                <Identicon
                                                                    value={`${license.licenseType}${license.licenseId}`}
                                                                />
                                                            </div>

                                                            <div className="col">
                                                                <div className="row gap-1.5">
                                                                    <div className="text-sm font-medium">
                                                                        License #{license.licenseId}
                                                                    </div>

                                                                    <div className="text-sm">•</div>

                                                                    <div className="center-all rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-medium">
                                                                        {license.licenseType}
                                                                    </div>
                                                                </div>

                                                                <CopyableAddress value={license.nodeAddress} size={8} />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                {results.some((r) => r.type === 'owner') && (
                                    <div className="col gap-2">
                                        {getSectionTitle('Accounts')}

                                        {results
                                            .filter((r): r is Extract<SearchResult, { type: 'owner' }> => r.type === 'owner')
                                            .map((owner, index) => (
                                                <div key={index}>
                                                    <Link
                                                        href={`${routePath.owner}/${owner.address}`}
                                                        className="row -mx-4 cursor-pointer px-4 py-2.5 transition-all hover:bg-slate-50"
                                                        onClick={onClose}
                                                    >
                                                        <div className="row gap-3">
                                                            <div className="relative h-8 w-8">
                                                                <Identicon value={`owner_${owner.address}`} />
                                                            </div>

                                                            <div className="col">
                                                                {!!owner.ensName && (
                                                                    <div className="text-sm font-medium">{owner.ensName}</div>
                                                                )}

                                                                <CopyableAddress value={owner.address} size={8} />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bottom bar */}
                        <div className="row w-full justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                            <div className="row gap-1 text-sm text-black/80">
                                <div className="center-all rounded-lg bg-slate-200 px-2 py-1 font-medium">ESC</div>
                                <div>To Cancel</div>
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    );
}
