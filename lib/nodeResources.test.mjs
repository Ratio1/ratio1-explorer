// Runtime test for the pure search-resources helper.
// Run with: node --test lib/nodeResources.test.mjs (needs Node >= 22.18 for built-in TypeScript type stripping)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pickNodeSearchResources } from './nodeResources.ts';

const full = {
    mem_total: 15.618,
    mem_avail: 13.208,
    cpu_cores: 4,
    cpu_cores_avail: 3.412,
    disk_total: 192.691,
    disk_avail: 184.223,
    default_cuda: 'cpu',
    gpu_name: null,
    debug_data: { gpu_info: 'long multi-line string' },
};

test('keeps only the four numeric fields the search card renders', () => {
    assert.deepEqual(pickNodeSearchResources(full), {
        cpu_cores: 4,
        cpu_cores_avail: 3.412,
        mem_avail: 13.208,
        mem_total: 15.618,
    });
});

test('returns undefined when resources are missing or empty', () => {
    assert.equal(pickNodeSearchResources(undefined), undefined);
    assert.equal(pickNodeSearchResources({}), undefined);
});

test('returns undefined when any of the four fields is null or not finite', () => {
    assert.equal(pickNodeSearchResources({ ...full, cpu_cores: null }), undefined);
    assert.equal(pickNodeSearchResources({ ...full, mem_avail: undefined }), undefined);
    assert.equal(pickNodeSearchResources({ ...full, mem_total: Number.NaN }), undefined);
    assert.equal(pickNodeSearchResources({ ...full, cpu_cores_avail: '3.4' }), undefined);
});

test('accepts zero as a valid available amount', () => {
    assert.deepEqual(pickNodeSearchResources({ ...full, cpu_cores_avail: 0, mem_avail: 0 }), {
        cpu_cores: 4,
        cpu_cores_avail: 0,
        mem_avail: 0,
        mem_total: 15.618,
    });
});
