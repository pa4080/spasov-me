// Source: https://unifiedjs.com/explore/package/remark-directive/#unifieduseremarkdirective
import { visit } from "unist-util-visit";

import { processCaption } from "./utils";

// This plugin is an example to turn `::pdf` into <embed>.
// Invoke syntax:
// > ::pdf[Caption [url](#url) or <a href="#">link</a>]{#pdf-id-1 href="https://pdf-url.com/pdf-id-1.pdf"}
// > ::pdf[This caption]{#pdf-id-2 url="https://media.spasov.me/files/spas-z-spasov-2015-thesis-abstract-full.pdf"}
export function myRemarkPlugin_Pdf() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (tree: any, file: { fail: (arg0: string, arg1: any) => void }) => {
		visit(tree, function (node) {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				if (node.name !== "pdf") {
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const data = node.data || (node.data = {});
				const attrib = node.attributes || {};
				// const id = attrib.id;
				const { src, url, href, ...attributes } = attrib;
				const embedSrc = src || url || href;

				if (node.type === "textDirective") {
					file.fail("Unexpected `:pdf` text directive, use two colons for a leaf directive", node);
				}

				if (!embedSrc) {
					file.fail("Unexpected missing `src|url|href` on `pdf` directive", node);
				}

				const caption = processCaption({ items: node.children });

				const embedNode = {
					type: "embed",
					data: {
						hName: "embed",
						hProperties: {
							src: embedSrc,
							width: "100%",
							height: "100%",
						},
					},
				};

				const divNodeContainer = {
					type: "div",
					children: [embedNode],
					data: {
						hName: "div",
						hProperties: {
							class: "md-embed-container md-embed-pdf",
						},
					},
				};

				const divNodeWrapper = {
					type: "div",
					children: [divNodeContainer],
					data: {
						hName: "div",
						hProperties: {
							class: "md-embed-wrapper",
						},
					},
				};

				const pCaption = {
					type: "p",
					children: [{ type: "html", value: caption }],
					data: {
						hName: "p",
						hProperties: {
							class: "md-embed-caption",
						},
					},
				};

				node.type = "div";
				node.children = [divNodeWrapper, pCaption];
				node.data.hProperties = {
					...attributes,
					class: attributes.class ? `${attributes.class} md-embed` : "md-embed",
				};
			}
		});
	};
}
