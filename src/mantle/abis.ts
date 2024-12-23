export const l2OutputOracleAbi = [
	{
		inputs: [
			{ internalType: "uint256", name: "_submissionInterval", type: "uint256" },
			{ internalType: "uint256", name: "_l2BlockTime", type: "uint256" },
			{
				internalType: "uint256",
				name: "_startingBlockNumber",
				type: "uint256",
			},
			{ internalType: "uint256", name: "_startingTimestamp", type: "uint256" },
			{ internalType: "address", name: "_proposer", type: "address" },
			{ internalType: "address", name: "_challenger", type: "address" },
			{
				internalType: "uint256",
				name: "_finalizationPeriodSeconds",
				type: "uint256",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: "uint8", name: "version", type: "uint8" },
		],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "outputRoot",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "l2OutputIndex",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "l2BlockNumber",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "l1Timestamp",
				type: "uint256",
			},
		],
		name: "OutputProposed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "prevNextOutputIndex",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "newNextOutputIndex",
				type: "uint256",
			},
		],
		name: "OutputsDeleted",
		type: "event",
	},
	{
		inputs: [],
		name: "CHALLENGER",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "FINALIZATION_PERIOD_SECONDS",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "L2_BLOCK_TIME",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "PROPOSER",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "SUBMISSION_INTERVAL",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_l2BlockNumber", type: "uint256" },
		],
		name: "computeL2Timestamp",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_l2OutputIndex", type: "uint256" },
		],
		name: "deleteL2Outputs",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_l2OutputIndex", type: "uint256" },
		],
		name: "getL2Output",
		outputs: [
			{
				components: [
					{ internalType: "bytes32", name: "outputRoot", type: "bytes32" },
					{ internalType: "uint128", name: "timestamp", type: "uint128" },
					{ internalType: "uint128", name: "l2BlockNumber", type: "uint128" },
				],
				internalType: "struct Types.OutputProposal",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_l2BlockNumber", type: "uint256" },
		],
		name: "getL2OutputAfter",
		outputs: [
			{
				components: [
					{ internalType: "bytes32", name: "outputRoot", type: "bytes32" },
					{ internalType: "uint128", name: "timestamp", type: "uint128" },
					{ internalType: "uint128", name: "l2BlockNumber", type: "uint128" },
				],
				internalType: "struct Types.OutputProposal",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_l2BlockNumber", type: "uint256" },
		],
		name: "getL2OutputIndexAfter",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_startingBlockNumber",
				type: "uint256",
			},
			{ internalType: "uint256", name: "_startingTimestamp", type: "uint256" },
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "latestBlockNumber",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "latestOutputIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "nextBlockNumber",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "nextOutputIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "bytes32", name: "_outputRoot", type: "bytes32" },
			{ internalType: "uint256", name: "_l2BlockNumber", type: "uint256" },
			{ internalType: "bytes32", name: "_l1BlockHash", type: "bytes32" },
			{ internalType: "uint256", name: "_l1BlockNumber", type: "uint256" },
		],
		name: "proposeL2Output",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "startingBlockNumber",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "startingTimestamp",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
] as const;

export const l2ToL1MessagePasserAbi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_l1mnt",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "nonce",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "target",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "mntValue",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "ethValue",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "gasLimit",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "data",
				type: "bytes",
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "withdrawalHash",
				type: "bytes32",
			},
		],
		name: "MessagePassed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "WithdrawerBalanceBurnt",
		type: "event",
	},
	{
		inputs: [],
		name: "L1_MNT_ADDRESS",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MESSAGE_VERSION",
		outputs: [
			{
				internalType: "uint16",
				name: "",
				type: "uint16",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "burn",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_ethValue",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_target",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_gasLimit",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes",
			},
		],
		name: "initiateWithdrawal",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "messageNonce",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "sentMessages",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		stateMutability: "payable",
		type: "receive",
	},
] as const;

export const portal2Abi = [
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_proofMaturityDelaySeconds",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "_disputeGameFinalityDelaySeconds",
				type: "uint256",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		stateMutability: "payable",
		type: "receive",
	},
	{
		inputs: [],
		name: "balance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "contract IDisputeGame",
				name: "_disputeGame",
				type: "address",
			},
		],
		name: "blacklistDisputeGame",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_withdrawalHash",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "_proofSubmitter",
				type: "address",
			},
		],
		name: "checkWithdrawal",
		outputs: [],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_mint",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "_value",
				type: "uint256",
			},
			{
				internalType: "uint64",
				name: "_gasLimit",
				type: "uint64",
			},
			{
				internalType: "bool",
				name: "_isCreation",
				type: "bool",
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes",
			},
		],
		name: "depositERC20Transaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_value",
				type: "uint256",
			},
			{
				internalType: "uint64",
				name: "_gasLimit",
				type: "uint64",
			},
			{
				internalType: "bool",
				name: "_isCreation",
				type: "bool",
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes",
			},
		],
		name: "depositTransaction",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "contract IDisputeGame",
				name: "",
				type: "address",
			},
		],
		name: "disputeGameBlacklist",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "disputeGameFactory",
		outputs: [
			{
				internalType: "contract DisputeGameFactory",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "disputeGameFinalityDelaySeconds",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "donateETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "nonce",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "sender",
						type: "address",
					},
					{
						internalType: "address",
						name: "target",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "value",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256",
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes",
					},
				],
				internalType: "struct Types.WithdrawalTransaction",
				name: "_tx",
				type: "tuple",
			},
		],
		name: "finalizeWithdrawalTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "nonce",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "sender",
						type: "address",
					},
					{
						internalType: "address",
						name: "target",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "value",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256",
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes",
					},
				],
				internalType: "struct Types.WithdrawalTransaction",
				name: "_tx",
				type: "tuple",
			},
			{
				internalType: "address",
				name: "_proofSubmitter",
				type: "address",
			},
		],
		name: "finalizeWithdrawalTransactionExternalProof",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "finalizedWithdrawals",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "guardian",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "contract DisputeGameFactory",
				name: "_disputeGameFactory",
				type: "address",
			},
			{
				internalType: "contract SystemConfig",
				name: "_systemConfig",
				type: "address",
			},
			{
				internalType: "contract SuperchainConfig",
				name: "_superchainConfig",
				type: "address",
			},
			{
				internalType: "GameType",
				name: "_initialRespectedGameType",
				type: "uint32",
			},
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "l2Sender",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_byteCount",
				type: "uint64",
			},
		],
		name: "minimumGasLimit",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64",
			},
		],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_withdrawalHash",
				type: "bytes32",
			},
		],
		name: "numProofSubmitters",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "params",
		outputs: [
			{
				internalType: "uint128",
				name: "prevBaseFee",
				type: "uint128",
			},
			{
				internalType: "uint64",
				name: "prevBoughtGas",
				type: "uint64",
			},
			{
				internalType: "uint64",
				name: "prevBlockNum",
				type: "uint64",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "proofMaturityDelaySeconds",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "proofSubmitters",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "nonce",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "sender",
						type: "address",
					},
					{
						internalType: "address",
						name: "target",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "value",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256",
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes",
					},
				],
				internalType: "struct Types.WithdrawalTransaction",
				name: "_tx",
				type: "tuple",
			},
			{
				internalType: "uint256",
				name: "_disputeGameIndex",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "bytes32",
						name: "version",
						type: "bytes32",
					},
					{
						internalType: "bytes32",
						name: "stateRoot",
						type: "bytes32",
					},
					{
						internalType: "bytes32",
						name: "messagePasserStorageRoot",
						type: "bytes32",
					},
					{
						internalType: "bytes32",
						name: "latestBlockhash",
						type: "bytes32",
					},
				],
				internalType: "struct Types.OutputRootProof",
				name: "_outputRootProof",
				type: "tuple",
			},
			{
				internalType: "bytes[]",
				name: "_withdrawalProof",
				type: "bytes[]",
			},
		],
		name: "proveWithdrawalTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "provenWithdrawals",
		outputs: [
			{
				internalType: "contract IDisputeGame",
				name: "disputeGameProxy",
				type: "address",
			},
			{
				internalType: "uint64",
				name: "timestamp",
				type: "uint64",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "respectedGameType",
		outputs: [
			{
				internalType: "GameType",
				name: "",
				type: "uint32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "respectedGameTypeUpdatedAt",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_token",
				type: "address",
			},
			{
				internalType: "uint8",
				name: "_decimals",
				type: "uint8",
			},
			{
				internalType: "bytes32",
				name: "_name",
				type: "bytes32",
			},
			{
				internalType: "bytes32",
				name: "_symbol",
				type: "bytes32",
			},
		],
		name: "setGasPayingToken",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "GameType",
				name: "_gameType",
				type: "uint32",
			},
		],
		name: "setRespectedGameType",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "superchainConfig",
		outputs: [
			{
				internalType: "contract SuperchainConfig",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "systemConfig",
		outputs: [
			{
				internalType: "contract SystemConfig",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "pure",
		type: "function",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "contract IDisputeGame",
				name: "disputeGame",
				type: "address",
			},
		],
		name: "DisputeGameBlacklisted",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "version",
				type: "uint8",
			},
		],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "GameType",
				name: "newGameType",
				type: "uint32",
			},
			{
				indexed: true,
				internalType: "Timestamp",
				name: "updatedAt",
				type: "uint64",
			},
		],
		name: "RespectedGameTypeSet",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "version",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "opaqueData",
				type: "bytes",
			},
		],
		name: "TransactionDeposited",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "withdrawalHash",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "bool",
				name: "success",
				type: "bool",
			},
		],
		name: "WithdrawalFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "withdrawalHash",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
		],
		name: "WithdrawalProven",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "withdrawalHash",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "proofSubmitter",
				type: "address",
			},
		],
		name: "WithdrawalProvenExtension1",
		type: "event",
	},
	{
		inputs: [],
		name: "AlreadyFinalized",
		type: "error",
	},
	{
		inputs: [],
		name: "BadTarget",
		type: "error",
	},
	{
		inputs: [],
		name: "Blacklisted",
		type: "error",
	},
	{
		inputs: [],
		name: "CallPaused",
		type: "error",
	},
	{
		inputs: [],
		name: "ContentLengthMismatch",
		type: "error",
	},
	{
		inputs: [],
		name: "EmptyItem",
		type: "error",
	},
	{
		inputs: [],
		name: "GasEstimation",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidDataRemainder",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidDisputeGame",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidGameType",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidHeader",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidMerkleProof",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidProof",
		type: "error",
	},
	{
		inputs: [],
		name: "LargeCalldata",
		type: "error",
	},
	{
		inputs: [],
		name: "NoValue",
		type: "error",
	},
	{
		inputs: [],
		name: "NonReentrant",
		type: "error",
	},
	{
		inputs: [],
		name: "OnlyCustomGasToken",
		type: "error",
	},
	{
		inputs: [],
		name: "OutOfGas",
		type: "error",
	},
	{
		inputs: [],
		name: "ProposalNotValidated",
		type: "error",
	},
	{
		inputs: [],
		name: "SmallGasLimit",
		type: "error",
	},
	{
		inputs: [],
		name: "TransferFailed",
		type: "error",
	},
	{
		inputs: [],
		name: "Unauthorized",
		type: "error",
	},
	{
		inputs: [],
		name: "UnexpectedList",
		type: "error",
	},
	{
		inputs: [],
		name: "UnexpectedString",
		type: "error",
	},
	{
		inputs: [],
		name: "Unproven",
		type: "error",
	},
] as const;

export const portalAbi = [
	{
		inputs: [
			{
				internalType: "contract L2OutputOracle",
				name: "_l2Oracle",
				type: "address",
			},
			{
				internalType: "address",
				name: "_guardian",
				type: "address",
			},
			{
				internalType: "bool",
				name: "_paused",
				type: "bool",
			},
			{
				internalType: "contract SystemConfig",
				name: "_config",
				type: "address",
			},
			{
				internalType: "address",
				name: "_l1MNT",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint8",
				name: "version",
				type: "uint8",
			},
		],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "Paused",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "version",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "opaqueData",
				type: "bytes",
			},
		],
		name: "TransactionDeposited",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "Unpaused",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "withdrawalHash",
				type: "bytes32",
			},
			{
				indexed: false,
				internalType: "bool",
				name: "success",
				type: "bool",
			},
		],
		name: "WithdrawalFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "withdrawalHash",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
		],
		name: "WithdrawalProven",
		type: "event",
	},
	{
		inputs: [],
		name: "GUARDIAN",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "L1_MNT_ADDRESS",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "L2_ORACLE",
		outputs: [
			{
				internalType: "contract L2OutputOracle",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "SYSTEM_CONFIG",
		outputs: [
			{
				internalType: "contract SystemConfig",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_ethTxValue",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "_mntValue",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_mntTxValue",
				type: "uint256",
			},
			{
				internalType: "uint64",
				name: "_gasLimit",
				type: "uint64",
			},
			{
				internalType: "bool",
				name: "_isCreation",
				type: "bool",
			},
			{
				internalType: "bytes",
				name: "_data",
				type: "bytes",
			},
		],
		name: "depositTransaction",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "donateETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "nonce",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "sender",
						type: "address",
					},
					{
						internalType: "address",
						name: "target",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "mntValue",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "ethValue",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256",
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes",
					},
				],
				internalType: "struct Types.WithdrawalTransaction",
				name: "_tx",
				type: "tuple",
			},
		],
		name: "finalizeWithdrawalTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "finalizedWithdrawals",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bool",
				name: "_paused",
				type: "bool",
			},
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_l2OutputIndex",
				type: "uint256",
			},
		],
		name: "isOutputFinalized",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "l2Sender",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_byteCount",
				type: "uint64",
			},
		],
		name: "minimumGasLimit",
		outputs: [
			{
				internalType: "uint64",
				name: "",
				type: "uint64",
			},
		],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [],
		name: "params",
		outputs: [
			{
				internalType: "uint128",
				name: "prevBaseFee",
				type: "uint128",
			},
			{
				internalType: "uint64",
				name: "prevBoughtGas",
				type: "uint64",
			},
			{
				internalType: "uint64",
				name: "prevBlockNum",
				type: "uint64",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "pause",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "uint256",
						name: "nonce",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "sender",
						type: "address",
					},
					{
						internalType: "address",
						name: "target",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "mntValue",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "ethValue",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "gasLimit",
						type: "uint256",
					},
					{
						internalType: "bytes",
						name: "data",
						type: "bytes",
					},
				],
				internalType: "struct Types.WithdrawalTransaction",
				name: "_tx",
				type: "tuple",
			},
			{
				internalType: "uint256",
				name: "_l2OutputIndex",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "bytes32",
						name: "version",
						type: "bytes32",
					},
					{
						internalType: "bytes32",
						name: "stateRoot",
						type: "bytes32",
					},
					{
						internalType: "bytes32",
						name: "messagePasserStorageRoot",
						type: "bytes32",
					},
					{
						internalType: "bytes32",
						name: "latestBlockhash",
						type: "bytes32",
					},
				],
				internalType: "struct Types.OutputRootProof",
				name: "_outputRootProof",
				type: "tuple",
			},
			{
				internalType: "bytes[]",
				name: "_withdrawalProof",
				type: "bytes[]",
			},
		],
		name: "proveWithdrawalTransaction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		name: "provenWithdrawals",
		outputs: [
			{
				internalType: "bytes32",
				name: "outputRoot",
				type: "bytes32",
			},
			{
				internalType: "uint128",
				name: "timestamp",
				type: "uint128",
			},
			{
				internalType: "uint128",
				name: "l2OutputIndex",
				type: "uint128",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "unpause",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		stateMutability: "payable",
		type: "receive",
	},
] as const;

export const l1StandardBridge = [
	{
		inputs: [
			{ internalType: "address payable", name: "_messenger", type: "address" },
			{ internalType: "address", name: "_l1mnt", type: "address" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "localToken",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "remoteToken",
				type: "address",
			},
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: false, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ERC20BridgeFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "localToken",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "remoteToken",
				type: "address",
			},
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: false, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ERC20BridgeInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "l1Token",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "l2Token",
				type: "address",
			},
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: false, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ERC20DepositInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "l1Token",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "l2Token",
				type: "address",
			},
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: false, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ERC20WithdrawalFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ETHBridgeFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ETHBridgeInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ETHDepositInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ETHWithdrawalFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "MNTBridgeFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "MNTBridgeInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "MNTDepositInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "MNTWithdrawalFinalized",
		type: "event",
	},
	{
		inputs: [],
		name: "L1_MNT_ADDRESS",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MESSENGER",
		outputs: [
			{
				internalType: "contract CrossDomainMessenger",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "OTHER_BRIDGE",
		outputs: [
			{ internalType: "contract StandardBridge", name: "", type: "address" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_localToken", type: "address" },
			{ internalType: "address", name: "_remoteToken", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "bridgeERC20",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_localToken", type: "address" },
			{ internalType: "address", name: "_remoteToken", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "bridgeERC20To",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "bridgeETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "bridgeETHTo",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "bridgeMNT",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "bridgeMNTTo",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_l1Token", type: "address" },
			{ internalType: "address", name: "_l2Token", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "depositERC20",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_l1Token", type: "address" },
			{ internalType: "address", name: "_l2Token", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "depositERC20To",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "depositETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "depositETHTo",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "depositMNT",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "uint32", name: "_minGasLimit", type: "uint32" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "depositMNTTo",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "address", name: "", type: "address" },
		],
		name: "deposits",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_localToken", type: "address" },
			{ internalType: "address", name: "_remoteToken", type: "address" },
			{ internalType: "address", name: "_from", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "finalizeBridgeERC20",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_from", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "finalizeBridgeETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_from", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "finalizeBridgeMNT",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_l1Token", type: "address" },
			{ internalType: "address", name: "_l2Token", type: "address" },
			{ internalType: "address", name: "_from", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "finalizeERC20Withdrawal",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_from", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "finalizeETHWithdrawal",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_from", type: "address" },
			{ internalType: "address", name: "_to", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
			{ internalType: "bytes", name: "_extraData", type: "bytes" },
		],
		name: "finalizeMantleWithdrawal",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "l2TokenBridge",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "messenger",
		outputs: [
			{
				internalType: "contract CrossDomainMessenger",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{ stateMutability: "payable", type: "receive" },
] as const;

export const l2StandardBridge = [
	{
		inputs: [
			{
				internalType: "address payable",
				name: "_otherBridge",
				type: "address",
			},
			{
				internalType: "address",
				name: "_l1mnt",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "l1Token",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "l2Token",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "DepositFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "localToken",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "remoteToken",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ERC20BridgeFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "localToken",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "remoteToken",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ERC20BridgeInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ETHBridgeFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "ETHBridgeInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "MNTBridgeFinalized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "MNTBridgeInitiated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "l1Token",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "l2Token",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "extraData",
				type: "bytes",
			},
		],
		name: "WithdrawalInitiated",
		type: "event",
	},
	{
		inputs: [],
		name: "L1_MNT_ADDRESS",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "MESSENGER",
		outputs: [
			{
				internalType: "contract CrossDomainMessenger",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "OTHER_BRIDGE",
		outputs: [
			{
				internalType: "contract StandardBridge",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_localToken",
				type: "address",
			},
			{
				internalType: "address",
				name: "_remoteToken",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "bridgeERC20",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_localToken",
				type: "address",
			},
			{
				internalType: "address",
				name: "_remoteToken",
				type: "address",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "bridgeERC20To",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_value",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "bridgeETH",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_value",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "bridgeETHTo",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "bridgeMNT",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "bridgeMNTTo",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "deposits",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_localToken",
				type: "address",
			},
			{
				internalType: "address",
				name: "_remoteToken",
				type: "address",
			},
			{
				internalType: "address",
				name: "_from",
				type: "address",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "finalizeBridgeERC20",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_from",
				type: "address",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "finalizeBridgeETH",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_from",
				type: "address",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "finalizeBridgeMNT",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_l1Token",
				type: "address",
			},
			{
				internalType: "address",
				name: "_l2Token",
				type: "address",
			},
			{
				internalType: "address",
				name: "_from",
				type: "address",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "finalizeDeposit",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "l1TokenBridge",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "messenger",
		outputs: [
			{
				internalType: "contract CrossDomainMessenger",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_l2Token",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "withdraw",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_l2Token",
				type: "address",
			},
			{
				internalType: "address",
				name: "_to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
			{
				internalType: "uint32",
				name: "_minGasLimit",
				type: "uint32",
			},
			{
				internalType: "bytes",
				name: "_extraData",
				type: "bytes",
			},
		],
		name: "withdrawTo",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		stateMutability: "payable",
		type: "receive",
	},
] as const;
