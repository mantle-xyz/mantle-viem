/* c8 ignore start */

import { createClient, http, publicActions } from "viem";
import { mainnet, sepolia } from "viem/chains";

import { anvilMainnet, anvilSepolia } from "./anvil.js";

export const mainnetClient = createClient({
	chain: mainnet,
	transport: http(anvilMainnet.forkUrl),
}).extend(publicActions);

export const sepoliaClient = createClient({
	chain: sepolia,
	transport: http(anvilSepolia.forkUrl),
}).extend(publicActions);

/* c8 ignore stop */
