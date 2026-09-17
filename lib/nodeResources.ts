import type * as types from '@/typedefs/blockchain';
import type { NodeSearchResources } from '@/typedefs/general';

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/**
 * Keeps only the resource fields the search results card renders, and only when all of them are usable numbers.
 * The oracle can omit `resources` entirely or send `null` fields when a node's summary is incomplete.
 */
export const pickNodeSearchResources = (resources?: Partial<types.Resources>): NodeSearchResources | undefined => {
    if (!resources) {
        return undefined;
    }

    const { cpu_cores, cpu_cores_avail, mem_avail, mem_total } = resources;

    if (
        !isFiniteNumber(cpu_cores) ||
        !isFiniteNumber(cpu_cores_avail) ||
        !isFiniteNumber(mem_avail) ||
        !isFiniteNumber(mem_total)
    ) {
        return undefined;
    }

    return { cpu_cores, cpu_cores_avail, mem_avail, mem_total };
};
