import { defineChain } from "viem";
import { chainConfig } from "viem/op-stack";

const sourceId = 11_155_111; // sepolia

export const mantleSepoliaTestnet = /*#__PURE__*/ defineChain({
	...chainConfig,
	id: 5003,
	name: "Mantle Sepolia Testnet",
	nativeCurrency: {
		decimals: 18,
		name: "MNT",
		symbol: "MNT",
	},
	rpcUrls: {
		default: { http: ["https://rpc.sepolia.mantle.xyz"] },
	},
	blockExplorers: {
		default: {
			name: "Mantle Testnet Explorer",
			url: "https://explorer.sepolia.mantle.xyz/",
			apiUrl: "https://explorer.sepolia.mantle.xyz/api",
		},
	},
	contracts: {
		...chainConfig.contracts,
		l2Erc721Bridge: undefined,
		l2OutputOracle: {
			[sourceId]: {
				address: "0x4121dc8e48Bc6196795eb4867772A5e259fecE07",
			},
		},
		portal: {
			[sourceId]: {
				address: "0xB3db4bd5bc225930eD674494F9A4F6a11B8EFBc8",
				blockCreated: 4858030,
			},
		},
		l1StandardBridge: {
			[sourceId]: {
				address: "0x21F308067241B2028503c07bd7cB3751FFab0Fb2",
				blockCreated: 4852137,
			},
		},
		multicall3: {
			address: "0xcA11bde05977b3631167028862bE2a173976CA11",
			blockCreated: 4584012,
		},
	},
	testnet: true,
	sourceId,
});
