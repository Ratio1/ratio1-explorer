'use client';

import { Alert } from '@/app/server-components/shared/Alert';
import { getNodeLastEpoch } from '@/lib/api/oracles';
import useDebounce from '@/lib/useDebounce';
import { getShortAddress, isNonZeroInteger, sleep } from '@/lib/utils';
import * as types from '@/typedefs/blockchain';
import { Input } from '@heroui/input';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import { useCallback, useEffect, useState } from 'react';
import { RiErrorWarningLine, RiLightbulbLine, RiSearchLine } from 'react-icons/ri';

export const Search = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);

    const [value, setValue] = useState<string>('');
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [results, setResults] = useState<
        {
            type: 'node' | 'ND' | 'MND' | 'GND';
            address: string;
        }[]
    >([]);

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (event.key === '/') {
            event.preventDefault();
            onOpen();
        }

        if (event.key === 'Escape') {
            onClose();
        }

        if (event.key === 'Enter' && isOpen) {
            console.log('Enter pressed');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const onSearch = async (query: string) => {
        if (!query) {
            setResults([]);
            setError(false);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            if (query.startsWith('0x') && query.length === 42) {
                console.log('Searching by ETH Address', query);

                const nodeResponse = await getNodeLastEpoch(query as types.EthAddress);
                console.log(nodeResponse);

                setResults([{ type: 'node', address: nodeResponse.node_eth_address }]);
                setError(false);
            } else if (isNonZeroInteger(query)) {
                console.log('Searching by License ID');
                await sleep(500);

                setResults([{ type: 'MND', address: '123' }]);
                setError(false);
            } else {
                console.log('We could not find any results matching your search.');
                setResults([]);
                setError(true);
            }
        } catch (error) {
            console.log(error);
            setResults([]);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useDebounce(
        () => {
            onSearch(value);
        },
        [value],
        500,
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

    return (
        <>
            <div className="max-w-lg">
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
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="lg"
                shouldBlockScroll={false}
                placement="top"
                hideCloseButton
            >
                <ModalContent>
                    <div className="col gap-4 p-4">
                        <Input
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
                                input: '!pl-2.5 text-[15px]',
                            }}
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Search the Ratio1 ecosystem"
                            startContent={<RiSearchLine className="text-xl text-slate-400" />}
                            endContent={isLoading ? <Spinner size="sm" /> : null}
                            maxLength={42}
                        />

                        {!results.length ? (
                            getAlert()
                        ) : (
                            <div className="col gap-2">
                                {results.map((result, index) => (
                                    <div key={index} className="row justify-between gap-4">
                                        <div>{getShortAddress(result.address, 8)}</div>
                                        <div>{result.type}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Bottom bar */}
                        <div className="row w-full justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                            <div className="row gap-1 text-sm text-black/80">
                                <div className="center-all rounded-lg bg-slate-200 px-2 py-1 font-medium">enter</div>
                                <div>To Select</div>
                            </div>

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
};
