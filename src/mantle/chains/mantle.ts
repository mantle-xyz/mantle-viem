import { defineChain } from "viem";
import { chainConfig } from "viem/op-stack";

const sourceId = 1; // mainnet

export const mantle = /*#__PURE__*/ defineChain({
	...chainConfig,
	id: 5000,
	name: "Mantle",
	nativeCurrency: {
		decimals: 18,
		name: "MNT",
		symbol: "MNT",
	},
	rpcUrls: {
		default: { http: ["https://rpc.mantle.xyz"] },
	},
	blockExplorers: {
		default: {
			name: "Mantle Explorer",
			url: "https://mantlescan.xyz/",
			apiUrl: "https://api.mantlescan.xyz/api",
		},
	},
	contracts: {
		...chainConfig.contracts,
		l2Erc721Bridge: undefined,
		l2OutputOracle: {
			[sourceId]: {
				address: "0x31d543e7BE1dA6eFDc2206Ef7822879045B9f481",
			},
		},
		portal: {
			[sourceId]: {
				address: "0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb",
				blockCreated: 19434938,
			},
		},
		l1StandardBridge: {
			[sourceId]: {
				address: "0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012",
				blockCreated: 17577718,
			},
		},
		multicall3: {
			address: "0xcA11bde05977b3631167028862bE2a173976CA11",
			blockCreated: 304717,
		},
	},
	testnet: true,
	sourceId,
});
