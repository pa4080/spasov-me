/**
 * For video embedding see:
 * +> https://github.com/unifiedjs/unified#processorprocesssyncfile
 * +> https://unifiedjs.com/explore/package/remark-directive/
 * -> https://unifiedjs.com/explore/package/rehype-video/
 * -> https://github.com/jaywcjlove/rehype-video/tree/main
 */
import { hyphenateSync as hyphenate } from "hyphen/en";
import rehypeExternalLinks, { Target } from "rehype-external-links";
import rehypeFormat from "rehype-format";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { myRemarkPlugin_Image, myRemarkPlugin_YouTube } from "./process-markdown-plugins";

export const new_tab_target = "spasov-me-tab" as Target;

export const processMarkdown = ({ markdown, hyphen }: { markdown: string; hyphen?: boolean }) => {
	const result = unified()
		.use(remarkParse)
		.use(remarkDirective)
		.use(myRemarkPlugin_YouTube)
		.use(myRemarkPlugin_Image)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeFormat)
		.use(rehypeExternalLinks, { rel: ["nofollow"], target: new_tab_target })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.use(rehypePrism, { showLineNumbers: false, ignoreMissing: true })
		.processSync(markdown);

	const resultStr = result.value.toString();

	if (hyphen) {
		// https://www.npmjs.com/package/hyphen
		return hyphenate(resultStr);
	}

	return resultStr;
};

export const splitDescriptionKeyword = /<!--\s*more\s*-->/;
// We want to remove all comments. It is not done
// by unified().use(remarkRehype), because we are
// using some of them as special tags, i.e. <!--more-->

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commentsMatcher = new RegExp("<!--.*?-->", "gs");

// export const commentsMatcher = /<!--.*?-->/gs;
// The above throws unresolvable error with TS 5.5.2
// TS1501: This regular expression flag is only available when targeting 'es2018' or later.
// Update the target in tsconfig.json does not help.
// https://github.com/microsoft/TypeScript/issues/58275
