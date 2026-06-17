import * as types from '@/typedefs/blockchain';

const NO_EPOCHS_FOUND_ERROR = 'No epochs found for the given node';

type OraclesSyncStatus = Partial<types.OraclesAvailabilityResult> & {
    server_current_epoch?: number;
    server_last_synced_epoch?: number;
    error?: string;
    availability_status?: types.OraclesAvailabilityStatus;
};

export const hasNoEpochsFoundError = (errorMessage?: string): boolean =>
    !!errorMessage && errorMessage.includes(NO_EPOCHS_FOUND_ERROR);

export const isNoEpochsResult = (
    status?: Partial<types.OraclesNoEpochsResult> | Partial<types.OraclesAvailabilityResult>,
): status is types.OraclesNoEpochsResult => !!status?.error && hasNoEpochsFoundError(status.error);

export const isOraclesSyncing = (status?: OraclesSyncStatus): boolean => {
    if (!status) {
        return false;
    }

    if (status.availability_status) {
        return status.availability_status === 'syncing';
    }

    return isOraclesBehind(status);
};

export const isOraclesBehind = (status?: OraclesSyncStatus, expectedLastEpoch?: number): boolean => {
    if (!status || typeof status.server_last_synced_epoch !== 'number') {
        return false;
    }

    const expectedEpoch =
        typeof expectedLastEpoch === 'number'
            ? expectedLastEpoch
            : typeof status.server_current_epoch === 'number'
              ? status.server_current_epoch - 1
              : undefined;

    return typeof expectedEpoch === 'number' && status.server_last_synced_epoch < expectedEpoch;
};
