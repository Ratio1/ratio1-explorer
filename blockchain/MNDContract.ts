export const MNDContractAbi = [
    {
        inputs: [],
        name: 'ERC721EnumerableForbiddenBatchMint',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC721IncorrectOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC721InsufficientApproval',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidOperator',
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
        name: 'ERC721InvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC721NonexistentToken',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
            },
        ],
        name: 'ERC721OutOfBoundsIndex',
        type: 'error',
    },
    {
        inputs: [],
        name: 'EnforcedPause',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ExpectedPause',
        type: 'error',
    },
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
        inputs: [
            {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
            },
        ],
        name: 'PRBMath_MulDiv18_Overflow',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'denominator',
                type: 'uint256',
            },
        ],
        name: 'PRBMath_MulDiv_Overflow',
        type: 'error',
    },
    {
        inputs: [],
        name: 'PRBMath_SD59x18_Div_InputTooSmall',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'SD59x18',
                name: 'x',
                type: 'int256',
            },
            {
                internalType: 'SD59x18',
                name: 'y',
                type: 'int256',
            },
        ],
        name: 'PRBMath_SD59x18_Div_Overflow',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'SD59x18',
                name: 'x',
                type: 'int256',
            },
        ],
        name: 'PRBMath_SD59x18_Exp2_InputTooBig',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'SD59x18',
                name: 'x',
                type: 'int256',
            },
        ],
        name: 'PRBMath_SD59x18_Exp_InputTooBig',
        type: 'error',
    },
    {
        inputs: [],
        name: 'PRBMath_SD59x18_Mul_InputTooSmall',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'SD59x18',
                name: 'x',
                type: 'int256',
            },
            {
                internalType: 'SD59x18',
                name: 'y',
                type: 'int256',
            },
        ],
        name: 'PRBMath_SD59x18_Mul_Overflow',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ReentrancyGuardReentrantCall',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'approved',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'ApprovalForAll',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: '_fromTokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_toTokenId',
                type: 'uint256',
            },
        ],
        name: 'BatchMetadataUpdate',
        type: 'event',
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
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalAssignedAmount',
                type: 'uint256',
            },
        ],
        name: 'LicenseCreated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'licenseId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'nodeAddress',
                type: 'address',
            },
        ],
        name: 'LinkNode',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'MetadataUpdate',
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
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'licenseId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'rewardsAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalEpochs',
                type: 'uint256',
            },
        ],
        name: 'RewardsClaimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'licenseId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'oldNodeAddress',
                type: 'address',
            },
        ],
        name: 'UnlinkNode',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [],
        name: 'GENESIS_TOKEN_ID',
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
        name: '_baseTokenURI',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: '_controller',
        outputs: [
            {
                internalType: 'contract Controller',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'newTotalAssignedAmount',
                type: 'uint256',
            },
        ],
        name: 'addLicense',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
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
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'currentEpoch',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'firstMiningEpoch',
                type: 'uint256',
            },
            {
                internalType: 'SD59x18',
                name: 'plateau',
                type: 'int256',
            },
        ],
        name: 'calculateEpochRelease',
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
                components: [
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'epochs',
                        type: 'uint256[]',
                    },
                    {
                        internalType: 'uint8[]',
                        name: 'availabilies',
                        type: 'uint8[]',
                    },
                ],
                internalType: 'struct ComputeRewardsParams',
                name: 'paramsArray',
                type: 'tuple',
            },
        ],
        name: 'calculateRewards',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'rewardsAmount',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct ComputeRewardsResult',
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
                components: [
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'epochs',
                        type: 'uint256[]',
                    },
                    {
                        internalType: 'uint8[]',
                        name: 'availabilies',
                        type: 'uint8[]',
                    },
                ],
                internalType: 'struct ComputeRewardsParams',
                name: 'computeParam',
                type: 'tuple',
            },
            {
                internalType: 'bytes[]',
                name: 'signatures',
                type: 'bytes[]',
            },
        ],
        name: 'claimRewards',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'getApproved',
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
        name: 'getCurrentEpoch',
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
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'getUserLicense',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
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
                        name: 'firstMiningEpoch',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'remainingAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lastClaimEpoch',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'claimableEpochs',
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
                ],
                internalType: 'struct LicenseInfo',
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
                name: 'tokenAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'controllerAddress',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
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
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
        ],
        name: 'initiateBurn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
        ],
        name: 'initiateTransfer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'initiatedBurn',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'initiatedTransferReceiver',
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
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'isApprovedForAll',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'nodeAddress',
                type: 'address',
            },
        ],
        name: 'isNodeActive',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'nodeAddress',
                type: 'address',
            },
        ],
        name: 'isNodeAlreadyLinked',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'licenses',
        outputs: [
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
                name: 'firstMiningEpoch',
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
            {
                internalType: 'address',
                name: 'newNodeAddress',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'signature',
                type: 'bytes',
            },
        ],
        name: 'linkNode',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'nodeToLicenseId',
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
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ownerOf',
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
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'registeredNodeAddresses',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
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
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'approved',
                type: 'bool',
            },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'baseURI',
                type: 'string',
            },
        ],
        name: 'setBaseURI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newLpWallet',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newExpensesWallet',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newMarketingWallet',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newGrantsWallet',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newCsrWallet',
                type: 'address',
            },
        ],
        name: 'setCompanyWallets',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'ndContract_',
                type: 'address',
            },
        ],
        name: 'setNDContract',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
            },
        ],
        name: 'tokenByIndex',
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
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'index',
                type: 'uint256',
            },
        ],
        name: 'tokenOfOwnerByIndex',
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
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'tokenURI',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalLicensesAssignedTokensAmount',
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
        name: 'totalSupply',
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
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
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
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'licenseId',
                type: 'uint256',
            },
        ],
        name: 'unlinkNode',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'licenseId',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'nodeAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'epochs',
                        type: 'uint256[]',
                    },
                    {
                        internalType: 'uint8[]',
                        name: 'availabilies',
                        type: 'uint8[]',
                    },
                ],
                internalType: 'struct ComputeRewardsParams',
                name: 'computeParam',
                type: 'tuple',
            },
            {
                internalType: 'bytes[]',
                name: 'signatures',
                type: 'bytes[]',
            },
        ],
        name: 'verifyRewardsSignatures',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;
