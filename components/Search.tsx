'use client';

import SearchResultsList from '@/app/server-components/SearchResultsList';
import { Alert } from '@/app/server-components/shared/Alert';
import { routePath } from '@/lib/routes';
import useDebounce from '@/lib/useDebounce';
import { clientSearch as search } from '@/lib/utils';
import { SearchResult } from '@/typedefs/general';
import { Input } from '@heroui/input';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { RiErrorWarningLine, RiLightbulbLine, RiSearchLine } from 'react-icons/ri';

export default function Search() {
    const router = useRouter();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);

    const [value, setValue] = useState<string>('');
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [results, setResults] = useState<SearchResult[]>([]);

    const isLoggingEnabled = true;

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
        setLoading(true);
        if (isLoggingEnabled) console.log('Searching...');
        const { results, error } = await search(query, isLoggingEnabled);
        if (isLoggingEnabled) console.log('Results', results);
        setResults(results);
        setError(error);
        if (isLoggingEnabled) console.log('Error searching', error);
        setLoading(false);
    };

    useDebounce(
        () => {
            if (value !== undefined) {
                onSearch(value);
            }
        },
        [value],
        600,
    );

    const getAlert = () => {
        if (!value || !isError) {
            return (
                <Alert
                    icon={<RiLightbulbLine className="text-lg" />}
                    title="Search"
                    description="Start writing to search for Nodes or owners using an ETH address/alias, or for Licenses using IDs."
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onClose();
                                    router.push(`${routePath.search}?query=${value || ''}`);
                                }

                                if (e.key === 'Escape') {
                                    onClose();
                                    setValue('');
                                }
                            }}
                        />

                        {!results.length ? (
                            getAlert()
                        ) : (
                            <SearchResultsList
                                results={results}
                                variant="modal"
                                onClose={onClose}
                                getSectionTitle={getSectionTitle}
                            />
                        )}

                        {/* Bottom bar */}
                        <div className="row w-full justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                            <div className="row gap-1 text-sm text-black/80">
                                <div className="center-all rounded-lg bg-slate-200 px-2 py-1 font-medium">ESC</div>
                                <div>To Cancel</div>
                            </div>

                            <div className="row gap-1 text-sm text-black/80">
                                <div className="center-all rounded-lg bg-slate-200 px-2 py-1 font-medium">Enter</div>
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </>
    );
}
