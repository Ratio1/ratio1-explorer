import * as types from '@/typedefs/blockchain';

const NO_EPOCHS_FOUND_ERROR = 'No epochs found for the given node';

type OraclesSyncStatus = Partial<types.OraclesAvailabilityResult> & {
    server_current_epoch?: number;
    server_last_synced_epoch?: number;
    error?: string;
};

export const hasNoEpochsFoundError = (errorMessage?: string): boolean =>
    !!errorMessage && errorMessage.includes(NO_EPOCHS_FOUND_ERROR);

export const isOraclesSyncing = (status?: OraclesSyncStatus): boolean => {
    if (!status) {
        return false;
    }

    if (
        typeof status.server_current_epoch === 'number' &&
        typeof status.server_last_synced_epoch === 'number' &&
        status.server_last_synced_epoch < status.server_current_epoch - 1
    ) {
        return true;
    }

    return hasNoEpochsFoundError(status.error);
};
