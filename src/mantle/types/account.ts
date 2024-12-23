import type { Address } from "viem";

import type { Account } from "viem";
import type { IsUndefined, MaybeRequired } from "viem";

export type GetAccountParameter<
	account extends Account | undefined = Account | undefined,
	accountOverride extends Account | Address | undefined = Account | Address,
	required extends boolean = true,
	nullish extends boolean = false,
> = MaybeRequired<
	{
		account?:
			| accountOverride
			| Account
			| Address
			| (nullish extends true ? null : never)
			| undefined;
	},
	IsUndefined<account> extends true
		? required extends true
			? true
			: false
		: false
>;
