// https://www.npmjs.com/package/hyphen
import { hyphenateSync as hyphenate } from "hyphen/en";

export const hyphenateString = (text: string) => {
	return hyphenate(text);
};
