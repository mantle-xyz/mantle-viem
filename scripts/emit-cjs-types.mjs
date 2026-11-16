// Emits CommonJS-scoped type declarations for the `require` export condition.
//
// `dist/types` inherits `"type": "module"` from package.json, so TypeScript
// consumers using `moduleResolution: node16 | nodenext` from a CommonJS file
// reject it with TS1479. Marking that same tree as CommonJS is not safe either:
// recent viem ships its own declarations as ESM, so ESM consumers would then
// fail to load viem's types. Instead we emit a second tree that is CommonJS
// scoped and imports viem's types explicitly with `resolution-mode: import`.
//
// Usage: node ./scripts/emit-cjs-types.mjs   (after `build:types`)

import { cp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = join(root, "dist/types");
const target = join(root, "dist/types-cjs");

const attributes = '{ "resolution-mode": "import" }';
const viemSpecifier = '"(viem(?:/[^"]+)?)"';
const importStatement = new RegExp(
	`^import (type )?\\{([^}]*)\\} from ${viemSpecifier};$`,
	"gm",
);
const importType = new RegExp(`import\\(${viemSpecifier}\\)`, "g");

/** @param {string} code */
export function transform(code) {
	const out = code
		.replace(importStatement, (_, _typeOnly, specifiers, module) => {
			const list = specifiers
				.split(",")
				.map((/** @type {string} */ s) => s.trim().replace(/^type /, ""))
				.filter(Boolean)
				.join(", ");
			// Only type-only imports may carry a resolution-mode attribute. In a
			// declaration file every import is type-level, including the one
			// used in `extends BaseError`, so all of them become `import type`.
			return `import type { ${list} } from "${module}" with ${attributes};`;
		})
		.replace(
			importType,
			(_, module) => `import("${module}", { with: ${attributes} })`,
		);

	// Fail the build on any viem reference this script does not understand.
	const unhandled = out
		.split("\n")
		.filter(
			(line) =>
				/"viem(\/[^"]+)?"/.test(line) && !line.includes('"resolution-mode"'),
		);
	if (unhandled.length)
		throw new Error(`unhandled viem reference:\n${unhandled.join("\n")}`);
	return out;
}

/** @param {string} dir @returns {Promise<string[]>} */
async function declarationFiles(dir) {
	// Manual walk: `readdir({ recursive })` needs Node >= 18.17 (.nvmrc is 18.12).
	const files = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) files.push(...(await declarationFiles(path)));
		else if (entry.name.endsWith(".d.ts")) files.push(path);
	}
	return files;
}

async function main() {
	await rm(target, { recursive: true, force: true });
	await cp(source, target, { recursive: true });
	await writeFile(
		join(target, "package.json"),
		`${JSON.stringify({ type: "commonjs" })}\n`,
	);
	const files = await declarationFiles(target);
	for (const file of files) {
		const code = await readFile(file, "utf8");
		try {
			await writeFile(file, transform(code));
		} catch (error) {
			throw new Error(`${relative(root, file)}: ${error.message}`);
		}
	}
	console.log(
		`emitted ${files.length} CommonJS declarations to dist/types-cjs`,
	);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
