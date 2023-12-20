// pnpm exec ts-node --skip-project scripts/generate-icon-map.ts
// convert hint: convert iso-g-code.png -resize x128 iso-g-code.png
// https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties

import sizeOf from "image-size";

import { IconMap } from "../interfaces/IconMap";

import fs from "fs";
import path from "path";

const iconsDir = "./public/assets/icons";
const iconsDirPath = path.join(process.cwd(), iconsDir);
const iconsDirContent = fs.readdirSync(iconsDirPath);
const iconsSubDirs = iconsDirContent
	.filter((item) => fs.statSync(path.join(iconsDirPath, item)).isDirectory())
	.map((item) => path.join(iconsDir, item));

const generateIconsMap = (dir: string): IconMap => {
	const directoryPath = path.join(process.cwd(), dir);
	const baseDirName = path.basename(directoryPath);

	const files = fs
		.readdirSync(directoryPath)
		.filter((file) => file.endsWith(".svg") || file.endsWith(".png") || file.endsWith(".webp"));

	const icons = files.reduce((acc: IconMap, fileName): IconMap => {
		const info = sizeOf(path.join(directoryPath, fileName)) as IconMap[string]["info"];

		info.ratio = Math.round((info.width / info.height + Number.EPSILON) * 100) / 100;

		const filePath = path.join(dir, fileName).replace(/^public/, "");

		const baseName = path
			.parse(fileName)
			.name.replace(/-light|-dark$/, "")
			.replace(/\s+/g, ""); // .replace(/(\s+|_|-)/g, "");

		const iconName = directoryPath === iconsDirPath ? baseName : baseDirName + "_" + baseName;

		if (!acc[iconName]) {
			acc[iconName] = {
				name: iconName,
				uri: { light: null, dark: null },
				info,
			} as unknown as IconMap[string];
		}

		if (fileName.includes("-light")) {
			acc[iconName].uri.light = filePath;
		} else {
			acc[iconName].uri.dark = filePath;
		}

		if (!acc[iconName].uri.light) {
			acc[iconName].uri.light = filePath;
		}

		if (!acc[iconName].uri.dark) {
			acc[iconName].uri.dark = filePath;
		}

		return acc;
	}, {});

	return icons;
};

const iconMap = [...iconsSubDirs, iconsDir].reduce((acc: IconMap, dir) => {
	return { ...acc, ...generateIconsMap(dir) };
}, {});

fs.writeFileSync(
	`${iconsDir}/index.ts`,
	"// This file is generated by scripts/generate-icon-map.ts\n\n" +
		`const iconsMap = ${JSON.stringify(iconMap, null, "\t")
			.replace(/"([a-zA-Z_$][0-9a-zA-Z_$]*)":/g, "$1:")
			.replace(/("|}|]|\d+)(?:\n)/g, "$1,\n")};` +
		"\n\nexport default iconsMap;" +
		"\n\nexport type IconsMapItem = keyof typeof iconsMap;\n"
);
