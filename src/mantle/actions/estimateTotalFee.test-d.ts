import { createClient, custom } from "viem";
import { expectTypeOf, test } from "vitest";
import { mantle } from "../chains/index.js";
import {
	estimateTotalFee,
	type EstimateTotalFeeReturnType,
} from "./estimateTotalFee.js";

const transport = custom({
	async request() {
		return "0x0";
	},
});

test("account is optional on a client without an account", () => {
	// The client has no account configured, and `eth_estimateTotalFee` accepts a
	// request without `from`. Omitting `account` must NOT be a type error — if
	// `account` were required for an account-less client, this call would fail to
	// compile (regression guard).
	const client = createClient({ chain: mantle, transport });
	expectTypeOf(
		estimateTotalFee(client, {
			to: "0x0000000000000000000000000000000000000002",
			value: 1n,
		}),
	).toEqualTypeOf<Promise<bigint>>();
});

test("account override is accepted", () => {
	const client = createClient({ chain: mantle, transport });
	expectTypeOf(
		estimateTotalFee(client, {
			account: "0x0000000000000000000000000000000000000001",
			to: "0x0000000000000000000000000000000000000002",
			value: 1n,
		}),
	).toEqualTypeOf<Promise<bigint>>();
});

test("chain override (including null) is accepted", () => {
	const client = createClient({ transport });
	expectTypeOf(
		estimateTotalFee(client, {
			account: "0x0000000000000000000000000000000000000001",
			chain: null,
		}),
	).toEqualTypeOf<Promise<bigint>>();
});

test("returns Promise<bigint>", () => {
	const client = createClient({ chain: mantle, transport });
	expectTypeOf(estimateTotalFee(client, {})).toEqualTypeOf<Promise<bigint>>();
	expectTypeOf<EstimateTotalFeeReturnType>().toEqualTypeOf<bigint>();
});
