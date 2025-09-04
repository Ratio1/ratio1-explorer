'use client';

import { Select, SelectItem } from '@heroui/select';
import { SharedSelection } from '@heroui/system';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function TagFilter({
    tags,
    currentTag,
}: {
    tags: string[];
    currentTag?: string;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const items = ['All', ...tags];

    const onSelectionChange = (selection: SharedSelection) => {
        const params = new URLSearchParams(searchParams);
        const key = selection.anchorKey as string | undefined;
        if (!key || key === 'All') {
            params.delete('tag');
        } else {
            params.set('tag', key);
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Select
            label="Filter by tag"
            selectedKeys={new Set([currentTag ?? 'All'])}
            onSelectionChange={onSelectionChange}
            items={items.map((tag) => ({ key: tag }))}
            className="mb-4 max-w-xs"
            aria-label="tag-filter"
            variant="flat"
        >
            {(item) => <SelectItem key={item.key}>{item.key}</SelectItem>}
        </Select>
    );
}
