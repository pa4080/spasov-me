/**
 * For video embedding see:
 * +> https://github.com/unifiedjs/unified#processorprocesssyncfile
 * +> https://unifiedjs.com/explore/package/remark-directive/
 * -> https://unifiedjs.com/explore/package/rehype-video/
 * -> https://github.com/jaywcjlove/rehype-video/tree/main
 */
import { hyphenateSync as hyphenate } from "hyphen/en";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks, { type Target } from "rehype-external-links";
import rehypeFormat from "rehype-format";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { unified } from "unified";

import { myRemarkPlugin_Image } from "./markdown-plugin-image";
import { myRemarkPlugin_Pdf } from "./markdown-plugin-pdf";
import { myRemarkPlugin_Video } from "./markdown-plugin-video";
import { myRemarkPlugin_YouTube } from "./markdown-plugin-youtube";

export const new_tab_target = "spasov-me-tab" as Target;

export const processMarkdown = ({ markdown, hyphen }: { markdown: string; hyphen?: boolean }) => {
  const result = unified()
    .use(remarkParse)
    .use(remarkToc, { ordered: false, maxDepth: 3, heading: "Table of Contents" })
    .use(remarkDirective)
    .use(myRemarkPlugin_YouTube)
    .use(myRemarkPlugin_Video)
    .use(myRemarkPlugin_Image)
    .use(myRemarkPlugin_Pdf)
    .use(remarkGfm) // Support GFM (tables, autolinks, tasklists, strikethrough)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug) // Add IDs to headings
    .use(
      rehypeAutolinkHeadings, // Optionally add links to headings
      {
        behavior: "wrap", // Wrap heading text in a link
        properties: { className: "autolink-anchor" },
        headingProperties: { className: "autolink-heading" },
        test: (node) => node.tagName !== "h1", // Skip <h1> tags
      }
    )
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

export const commentsMatcher = new RegExp("<!--.*?-->", "gs");

// export const commentsMatcher = /<!--.*?-->/gs;
// The above throws unresolvable error with TS 5.5.2
// TS1501: This regular expression flag is only available when targeting 'es2018' or later.
// Update the target in tsconfig.json does not help.
// https://github.com/microsoft/TypeScript/issues/58275
