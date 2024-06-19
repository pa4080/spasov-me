/**
 * For video embedding see:
 * -> https://unifiedjs.com/explore/package/rehype-video/
 * -> https://github.com/jaywcjlove/rehype-video/tree/main
 * +> https://unifiedjs.com/explore/package/remark-directive/
 */
import { hyphenateSync as hyphenate } from "hyphen/en";
import rehypeExternalLinks, { Target } from "rehype-external-links";
import rehypeFormat from "rehype-format";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const new_tab_target = "spasov-me-tab" as Target;

export const processMarkdown = ({ markdown, hyphen }: { markdown: string; hyphen?: boolean }) => {
	// https://github.com/unifiedjs/unified
	// https://github.com/unifiedjs/unified#processorprocesssyncfile
	const result = unified()
		.use(remarkParse)
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
export const commentsMatcher = /<!--.*?-->/gs;
