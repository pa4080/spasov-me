// Source: https://unifiedjs.com/explore/package/remark-directive/#unifieduseremarkdirective
import { visit } from "unist-util-visit";

// Embed image with caption. TODO: read the caption as html in order to process links or other html.
export function myRemarkPlugin_Image() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	return (tree: any, file: { fail: (arg0: string, arg1: any) => void }) => {
		visit(tree, function (node) {
			if (node.type === "leafDirective" && node.name === "img") {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const data = node.data || (node.data = {});
				const attributes = node.attributes || {};
				const image = node.children[0];

				if (image.type !== "image") {
					return;
				}

				const imageWrapper = {
					type: "div",
					children: [image],
					data: {
						hName: "div",
						hProperties: {
							class: "image-wrapper",
						},
					},
				};

				const caption = [];

				if (image.title) {
					caption.push({
						type: "span",
						children: [{ type: "text", value: `${image.title} ` }],
						data: {
							hName: "span",
							hProperties: {
								class: "image-caption-label",
							},
						},
					});
				}

				if (image.alt) {
					caption.push({
						type: "span",
						children: [{ type: "text", value: image.alt }],
						data: {
							hName: "span",
							hProperties: {
								class: "image-caption-text",
							},
						},
					});
				}

				const pCaption = {
					type: "p",
					children: caption,
					data: {
						hName: "p",
						hProperties: {
							class: "image-caption",
						},
					},
				};

				node.type = "div";
				node.children = [imageWrapper, pCaption];
				node.data["hProperties"] = {
					...attributes,
					class: attributes.class ? `${attributes.class} image-container` : "image-container",
				};
			}
		});
	};
}
