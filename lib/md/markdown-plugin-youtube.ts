// Source: https://unifiedjs.com/explore/package/remark-directive/#unifieduseremarkdirective
import { visit } from "unist-util-visit";

import { processCaption } from "./utils";

// This plugin is an example to turn `::youtube` into <iframe>.
// Invoke syntax:
// > ::youtube[Caption <a href="#">link</a>]{#5yEG6GhoJBs}
// > ::youtube[Caption [url](#url) or <a href="#">link</a>]{#5yEG6GhoJBs}
export function myRemarkPlugin_YouTube() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (tree: any, file: { fail: (arg0: string, arg1: any) => void }) => {
		visit(tree, function (node) {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				if (node.name !== "youtube") {
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const data = node.data || (node.data = {});
				const attributes = node.attributes || {};
				const id = attributes.id;

				if (node.type === "textDirective") {
					file.fail(
						"Unexpected `:youtube` text directive, use two colons for a leaf directive",
						node
					);
				}

				if (!id) {
					file.fail("Unexpected missing `id` on `youtube` directive", node);
				}

				/**
				data.hName = "iframe";
				data.hProperties = {
					src: "https://www.youtube.com/embed/" + id,
					width: "100%",
					height: "100%",
					frameBorder: 0,
					allow: "picture-in-picture",
					allowFullScreen: true,
				};
				 */

				const caption = processCaption({ items: node.children });

				const iframeNode = {
					type: "iframe",
					data: {
						hName: "iframe",
						hProperties: {
							src: "https://www.youtube.com/embed/" + id,
							width: "100%",
							height: "100%",
							frameBorder: 0,
							allow: "picture-in-picture",
							allowFullScreen: true,
						},
					},
				};

				const divNodeContainer = {
					type: "div",
					children: [iframeNode],
					data: {
						hName: "div",
						hProperties: {
							class: "md-embed-container",
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
					class: "md-embed",
				};
			}
		});
	};
}
