export const AdoptionOracleAbi = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'newThreshold',
                type: 'uint256',
            },
        ],
        name: 'NdFullReleaseThresholdUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'newThreshold',
                type: 'uint256',
            },
        ],
        name: 'PoaiVolumeFullReleaseThresholdUpdated',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'epoch',
                type: 'uint256',
            },
        ],
        name: 'getAdoptionPercentageAtEpoch',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'fromEpoch',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'toEpoch',
                type: 'uint256',
            },
        ],
        name: 'getAdoptionPercentagesRange',
        outputs: [
            {
                internalType: 'uint16[]',
                name: '',
                type: 'uint16[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'epoch',
                type: 'uint256',
            },
        ],
        name: 'getLicensesSoldAtEpoch',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'fromEpoch',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'toEpoch',
                type: 'uint256',
            },
        ],
        name: 'getLicensesSoldRange',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'epoch',
                type: 'uint256',
            },
        ],
        name: 'getPoaiVolumeAtEpoch',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'fromEpoch',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'toEpoch',
                type: 'uint256',
            },
        ],
        name: 'getPoaiVolumeRange',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'ndContract_',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'poaiManager_',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'ndFullReleaseThreshold_',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'poaiVolumeFullReleaseThreshold_',
                type: 'uint256',
            },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256[]',
                name: 'epochs',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: 'totals',
                type: 'uint256[]',
            },
        ],
        name: 'initializeLicenseSales',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256[]',
                name: 'epochs',
                type: 'uint256[]',
            },
            {
                internalType: 'uint256[]',
                name: 'totals',
                type: 'uint256[]',
            },
        ],
        name: 'initializePoaiVolumes',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'ndContract',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'ndFullReleaseThreshold',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poaiManager',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'poaiVolumeFullReleaseThreshold',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'epoch',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'newLicensesSold',
                type: 'uint256',
            },
        ],
        name: 'recordLicenseSales',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'epoch',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'newPoaiVolume',
                type: 'uint256',
            },
        ],
        name: 'recordPoaiVolume',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'newThreshold',
                type: 'uint256',
            },
        ],
        name: 'setNdFullReleaseThreshold',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'newThreshold',
                type: 'uint256',
            },
        ],
        name: 'setPoaiVolumeFullReleaseThreshold',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalLicensesSold',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalPoaiVolume',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;
