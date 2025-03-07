export const ReaderAbi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_ndContract',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_mndContract',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'getLicensesTotalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: 'mndSupply',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'ndSupply',
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
                name: 'licenseId',
                type: 'uint256',
            },
        ],
        name: 'getMndLicenseDetails',
        outputs: [
            {
                components: [
                    {
                        internalType: 'enum LicenseType',
                        name: 'licenseType',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalAssignedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalClaimedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lastClaimEpoch',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assignTimestamp',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'lastClaimOracle',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'isBanned',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LicenseDetails',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'licenseId',
                type: 'uint256',
            },
        ],
        name: 'getNdLicenseDetails',
        outputs: [
            {
                components: [
                    {
                        internalType: 'enum LicenseType',
                        name: 'licenseType',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalAssignedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalClaimedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lastClaimEpoch',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assignTimestamp',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'lastClaimOracle',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'isBanned',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LicenseDetails',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'node',
                type: 'address',
            },
        ],
        name: 'getNodeLicenseDetails',
        outputs: [
            {
                components: [
                    {
                        internalType: 'enum LicenseType',
                        name: 'licenseType',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalAssignedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalClaimedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lastClaimEpoch',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assignTimestamp',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'lastClaimOracle',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'isBanned',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LicenseDetails',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'node',
                type: 'address',
            },
        ],
        name: 'getNodeLicenseDetailsByNode',
        outputs: [
            {
                internalType: 'uint256',
                name: 'licenseId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'assignTimestamp',
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
                name: 'user',
                type: 'address',
            },
        ],
        name: 'getUserLicenses',
        outputs: [
            {
                components: [
                    {
                        internalType: 'enum LicenseType',
                        name: 'licenseType',
                        type: 'uint8',
                    },
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalAssignedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalClaimedAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lastClaimEpoch',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'assignTimestamp',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'lastClaimOracle',
                        type: 'address',
                    },
                    {
                        internalType: 'bool',
                        name: 'isBanned',
                        type: 'bool',
                    },
                ],
                internalType: 'struct LicenseDetails[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'mndContract',
        outputs: [
            {
                internalType: 'contract IMND',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'ndContract',
        outputs: [
            {
                internalType: 'contract IND',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
