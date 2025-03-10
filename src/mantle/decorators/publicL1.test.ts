import { describe, expect, test } from "vitest";

import { createPublicClient, http, parseEther } from "viem";
import { accounts } from "~test/src/constants.js";
import { sepoliaClient } from "~test/src/utils.js";
import { mantleSepoliaTestnet } from "../chains/index.js";
import { getWithdrawals } from "../utils/getWithdrawals.js";
import { publicActionsL1 } from "./publicL1.js";

const client = sepoliaClient.extend(publicActionsL1());
const l2Client = createPublicClient({
	chain: mantleSepoliaTestnet,
	transport: http(),
});

test("default", async () => {
	expect(publicActionsL1()(sepoliaClient)).toMatchInlineSnapshot(`
		{
		  "estimateDepositERC20Gas": [Function],
		  "estimateDepositETHGas": [Function],
		  "estimateDepositMNTGas": [Function],
		  "estimateFinalizeWithdrawalGas": [Function],
		  "estimateProveWithdrawalGas": [Function],
		  "getL2Output": [Function],
		  "getPortalVersion": [Function],
		  "getTimeToFinalize": [Function],
		  "getTimeToNextL2Output": [Function],
		  "getTimeToProve": [Function],
		  "getWithdrawalStatus": [Function],
		  "waitForNextL2Output": [Function],
		  "waitToFinalize": [Function],
		  "waitToProve": [Function],
		}
	`);
});

describe("smoke test", () => {
	test("estimateDepositETHGas", async () => {
		const gas = await client.estimateDepositETHGas({
			account: accounts[0].address,
			request: {
				amount: parseEther("0.001"),
			},
			targetChain: mantleSepoliaTestnet,
		});
		expect(gas).toBeDefined();
	});

	test.skip("estimateProveWithdrawalGas", async () => {
		const gas = await client.estimateProveWithdrawalGas({
			account: accounts[0].address,
			l2OutputIndex: 25937n,
			outputRootProof: {
				latestBlockhash:
					"0x04be9c2eeff0e70a02b4e62cf7a4a4bd59c69c79e0bfb21f7c185c6b98398772",
				messagePasserStorageRoot:
					"0x661e354bbcea922e306eb92d61888950ee19117b433cccabd8b35be4dc933367",
				stateRoot:
					"0xb6c2b2ba5bdea00a754572a2f5e8a6df10718dc6480882b2e1657798efc3002a",
				version:
					"0x0000000000000000000000000000000000000000000000000000000000000000",
			},
			withdrawalProof: [
				"0xf90211a03f8514ba0d8bc5830f513f17ba45d670ea4880b52d25c675d435a8874edfa7c5a0bab9984aebbf15a68af635e8cd415467ee32a51ec35a4a0eeb2c0194ec05d842a088dcee13d48aa438d9ce0a6eed0a95d9367d95aa38eca9fe28f9331489b6d19aa0048ad1035ef4f7fb5a986a9f3069730032dd339e2691ef37ba8375bf2d100798a0d3f35e8e6ec4e2fcf30a706aa0b858c4f63cb04058d0f7b7485b4de1301b4c06a01edab6389b0609992be0967b9e4dfe91aea43c2099b5f7db16b87307bb63d54ea073a1b8038138ad98d53d7ecc7dd72ac956e80aa97c7a14909e490c384dd76600a0ecb628c90effc914e6b969d34aec4e2bb55d25dfbed72b91ca40cfd571c1b64da083468b5d678e5dbdc008104c2031b7016f9dc4bb1e6990689c4d97c7643e2b5aa0129fd0515f5b7e226349f2c7e70bb120cab8f998ee56c061358e049858cbf784a08522c3c415ea4828efac9b97cf2ef9fefdb92670fc4fc0721da60829b9c2b3c5a0d9430f67b5a5a96a7e1b104fe0203c0d7a6310afe4866c2e3da66216bcb46568a0c979476e33ca25c6c0837744f813a1721b339f377ab2b07ec20f832fcef32adea000ccaa23258adbc7eea44770fa5c0c62e9a1fbf17855cc74bac56603160e8d09a0b65b5bce334179f843bf3173e7dee13d1bfea106b75a850bc8fde2ccf9a588aca00f017669502dd0be7cd90fe7a7e5029d9d7cf632b9493e9fd890cc277792bc7c80",
				"0xf90211a002ec335291354e72055561898f2c0ac479caccd056611d61459373d1b7579841a08dda6cf8aef38a17cc980a5db66aee25a950159bc55003717e69ce9dbb94021ba0de9484788c0749ba42d0697e10280978a5b78ce54c1f080f95bde0692ba40c84a04679724c70369f929bbea9757632d1092c3c25544f0a4004bcee2e6f608fadeaa0d3d5685e2ba04cab1534b82991ec93e4fdc72e5691de967dedd64813d9d77578a06feb06c3dd00300b1c07cd84e3374fb41025755ad5dd3901c05654f3fcea20c7a0a95a851143961dda2811cd878975eaf9553bfd1d4d4654fbbbe22a83e56535e8a0a8d6773faf5c86bb509ede6ac9773a2a78ab43e49ecf9fe4da3337d9ff8e093ca0de07e15cfa0637a9066afa5f4422d4f54bd29eb6830bb824e1dfc1e65f379b27a0c936d67cf3d7fce5894e875ed5a975269067200ae9340e20250ff025e1b01c0da0d72ab0759be0fb13d181b3113772c8456be4d352d3efea7ac46f990af6d1c4d4a0007baeaabc2caa3f1d59321bffcac63ac1bde9d5d92766e2d39aeb338e525319a021b8abd2d53c5c5264616152d2d95f92822360c00c34f242d5d05f8aecf3953ca0bc96d0d529cb426c76d820d555b782b9d8fa4bf0db9f797c5344a59be42a80a0a0122183ece60e2bb9b707a71857dfbe170753a850bc6f756ef0cd52c5113bdcbaa09ba3e6661a3c27681cf1a6b2cd48fcdfa7168be9209e438f4f9d5048a0941eb880",
				"0xf90211a0e564b4a1ef738fee4a7909153f27a7ffe12bb83fe920abd069f594572977ae7fa0e609c8257292c15bf58387b8643607888fe2e12fdc5bc0f7f1dfda53c47ac313a0c3d7216f130c71e20bbdfd1f35fb582bd6d328a1cd60f7c8576710c68c86a72aa00b8e62a418a798824cb751bacfb4516345cafaea6d2114531db6ba4d0efb051aa01f7d7fb0d6bf729426d0c4a7f3ba9dd9275aca43b02d76b32ecc29bec7c13fafa03ba89ea0a3bbf8e2840db8a59477fea409ca75f6f8768a6a167992e399abcddaa03dea3bb3320f4873f993025988c8d7c68fa92706e68be33ee8dcebc076f19c16a056992f91c68807749226ed28c9f30281bd75cffb2e466509b4fd6e96a5dd2a8fa03b35cf921bdecf23bab80ab051e5df778b65c3a9e6bc1f43c0554990e078bd95a06f1becac53de264196c0f580b361d4ef5f4922bc9c22b5cd0c8990fc7c29a182a0948c9047108b018f39fe87c29cf6119eb9cf8bfb891d81969a450ec658c11694a0502d5ec489aa5cf5776796acbbdd67d9f1084f350905580c5852340bfdc8eb28a01724ec68b08b6b83e50cfe277818cc24e4a6a7f53a3e75c4061bcd63d54206c0a0e28e6fbd19894da7869e41d58b71b2591a1489d7f8c8a3b406642ce671003926a04edf4067094bed4414e6e45571a4238e1f32f2a437b53e094c3be3073555fb20a0bac58b8650ebda3bdcc77606fcacffb269decbc78ce060c46131d76821b8f92780",
				"0xf90111a00ac31eb390297c1b0c4ba730c4710d3640bffffc7bffb7d689d43c1593c82d90a017734b56089504aec12856198e62375b92ef4f710070d3bfb340b87e18b0ba72a0236659fc27b2b180dbc47191162fe316ee05a2ff33b745ba04190e6553055457a05fd54bd9475b127304675e420c56e95a6d3eb4d0d0e3bab47d1b567506fc24d28080a0574ef0b48ac3e63622417a75a0f9ed97f607b4026fdaab3db0bdd5f75f1741c480a093a06fbb4d3da9038f6d6b95d93b86cdca423c74887cc4ea9a70477a329d56a580a0953d9fbf6d3248a35e2c3ddc9fb544d90d2df16e6c26823ddf8161c204317f0d80a0d73fbe773cba53aaa09e113c7cbee7aad1b6eebdb14e825a97379e4b36b9d8f280808080",
				"0xf85180808080808080a0854daa16929cd303478e9a5baa2262ad4048c8e264ad6fedd90ce1e2c2b705d280808080808080a095fc1c6ae0ba7d47f2ac45baebccf64c974486c62d07184116047d21e66a7b5780",
				"0xe09e37b9285794db7af385f42e01bf05c5759861bb6946d008955c2936f41e3e01",
			],
			withdrawal: {
				data: "0xff8daf150001000000000000000000000000000000000000000000000000000000008c3c000000000000000000000000420000000000000000000000000000000000001000000000000000000000000021f308067241b2028503c07bd7cb3751ffab0fb2000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000a4f407a99e000000000000000000000000c3ac498cdfb6e1dcfa17cbc55e514560f26a1922000000000000000000000000c3ac498cdfb6e1dcfa17cbc55e514560f26a1922000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
				gasLimit: 287624n,
				ethValue: 0n,
				mntValue: 100000000000000000n,
				nonce:
					1766847064778384329583297500742918515827483896875618958121606201292655676n,
				sender: "0x4200000000000000000000000000000000000007",
				target: "0x37dAC5312e31Adb8BB0802Fc72Ca84DA5cDfcb4c",
				withdrawalHash:
					"0x1086b9b7769971e13c0f7b1bfd9dba9825b34dafd44e4256e12d93b54107a675",
			},
			targetChain: mantleSepoliaTestnet,
		});
		expect(gas).toBeDefined();
	});

	test("getL2Output", async () => {
		const request = await client.getL2Output({
			l2BlockNumber: 11997809n,
			targetChain: mantleSepoliaTestnet,
		});
		expect(request).toBeDefined();
	});

	test("getPortalVersion", async () => {
		const request = await client.getPortalVersion({
			targetChain: mantleSepoliaTestnet,
		});
		expect(request).toBeDefined();
	});

	test("getTimeToNextL2Output", async () => {
		const l2BlockNumber = await l2Client.getBlockNumber();
		const request = await client.getTimeToNextL2Output({
			l2BlockNumber,
			targetChain: mantleSepoliaTestnet,
		});
		expect(request).toBeDefined();
	});

	test("getWithdrawalStatus", async () => {
		const receipt = await l2Client.getTransactionReceipt({
			hash: "0x4649507c557704fcb0047a02b90b1b031630336348ed3ebb97210fa9491d8b33",
		});
		await client.getWithdrawalStatus({
			receipt,
			targetChain: mantleSepoliaTestnet,
		});
	});

	test("waitForNextL2Output", async () => {
		const request = await client.waitForNextL2Output({
			l2BlockNumber: 11997809n,
			targetChain: mantleSepoliaTestnet,
		});
		expect(request).toBeDefined();
	});

	test("waitToFinalize", async () => {
		const receipt = await l2Client.getTransactionReceipt({
			hash: "0x4649507c557704fcb0047a02b90b1b031630336348ed3ebb97210fa9491d8b33",
		});
		const [withdrawal] = getWithdrawals(receipt);
		await client.waitToFinalize({
			withdrawalHash: withdrawal!.withdrawalHash,
			targetChain: mantleSepoliaTestnet,
		});
	});

	test("waitToProve", async () => {
		const receipt = await l2Client.getTransactionReceipt({
			hash: "0x4649507c557704fcb0047a02b90b1b031630336348ed3ebb97210fa9491d8b33",
		});
		const request = await client.waitToProve({
			receipt,
			targetChain: mantleSepoliaTestnet,
		});
		expect(request).toBeDefined();
	});
});
