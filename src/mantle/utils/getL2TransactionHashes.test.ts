import { expect, test } from "vitest";
import { mainnetClient } from "~test/src/utils.js";
import { getL2TransactionHashes } from "./getL2TransactionHashes.js";

test("default", async () => {
	const receipt = await mainnetClient.getTransactionReceipt({
		hash: "0xac1f228e28589c958e89bae67e13266fd8e83dcbaf817d7084c648438ff1de2f",
	});

	const l2Hashes = getL2TransactionHashes(receipt);

	expect(l2Hashes).toMatchInlineSnapshot(`
    [
      "0x37824efe792292078ecb08151e52d66d0d098b47aea81bc3a5a6c3dab208d8bc",
    ]
  `);
});
