'use client';

import { Alert } from '@/app/server-components/shared/Alert';
import { isNonZeroInteger } from '@/lib/utils';
import { Input } from '@heroui/input';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import { useCallback, useEffect, useState } from 'react';
import { RiLightbulbLine, RiSearchLine } from 'react-icons/ri';
import { usePublicClient } from 'wagmi';

export const Search = () => {
    const [value, setValue] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const publicClient = usePublicClient();

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

    const search = async () => {
        if (!publicClient) {
            console.error('No publicClient available');
            return;
        }

        setLoading(true);

        if (value.startsWith('0x') && value.length === 42) {
            console.log('Searching by ETH Address');
        } else if (isNonZeroInteger(value)) {
            console.log('Searching by License ID');
        } else {
            console.error('We could not find any results matching your search.');
        }

        setTimeout(() => {
            setLoading(false);
        }, 300);
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
                        <div className="text-slate-400">Search the Ratio1 ecosystem</div>
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
                                input: '!pl-2.5',
                            }}
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Search the Ratio1 ecosystem"
                            startContent={<RiSearchLine className="text-xl text-slate-400" />}
                            endContent={isLoading ? <Spinner size="sm" /> : null}
                            maxLength={42}
                        />

                        <Alert
                            icon={<RiLightbulbLine className="text-lg" />}
                            title="Search"
                            description="Start writing to search for Nodes or owners using an ETH address or for Licenses using IDs."
                        />

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
