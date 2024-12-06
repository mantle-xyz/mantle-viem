import type { Client, Transport } from "viem";
import type { Chain } from "viem";
import type { Account } from "viem";
import type { ErrorType } from "../errors/utils.js";
import { wait } from "../utils/wait.js";
import {
	getTimeToFinalize,
	type GetTimeToFinalizeErrorType,
	type GetTimeToFinalizeParameters,
} from "./getTimeToFinalize.js";

export type WaitToFinalizeParameters<
	chain extends Chain | undefined = Chain | undefined,
	chainOverride extends Chain | undefined = Chain | undefined,
> = GetTimeToFinalizeParameters<chain, chainOverride>;
export type WaitToFinalizeReturnType = void;
export type WaitToFinalizeErrorType = GetTimeToFinalizeErrorType | ErrorType;

/**
 * @param client - Client to use
 * @param parameters - {@link WaitToFinalizeParameters}
 */
export async function waitToFinalize<
	chain extends Chain | undefined,
	account extends Account | undefined,
	chainOverride extends Chain | undefined = undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: WaitToFinalizeParameters<chain, chainOverride>,
): Promise<WaitToFinalizeReturnType> {
	const { seconds } = await getTimeToFinalize(client, parameters);
	await wait(seconds * 1000);
}
