// Source: https://unifiedjs.com/explore/package/remark-directive/#unifieduseremarkdirective
import { visit } from "unist-util-visit";

// Embed image with caption. TODO: read the caption as html in order to process links or other html.
// Invoke syntax:
// > ::img[![Img ALT example <a href="#">link</a>](https://image-url.com "Img TITLE")]{#id-of-the-container}

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
							class: "md-embed-image-wrapper md-embed-image ",
						},
					},
				};

				const caption = [];

				if (image.title) {
					caption.push({
						type: "span",
						children: [{ type: "html", value: `${image.title} ` }],
						data: {
							hName: "span",
							hProperties: {
								class: "md-embed-caption-label",
							},
						},
					});
				}

				// Using 'processCaption({ items: ... })' here makes the things un necessary complicated.
				// So if you need to have links in the caption - use '<a>' tags in the alt of the image.

				if (image.alt) {
					caption.push({
						type: "span",
						children: [{ type: "html", value: image.alt }],
						data: {
							hName: "span",
							hProperties: {
								class: "md-embed-caption-text",
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
							class: "md-embed-caption",
						},
					},
				};

				node.type = "div";
				node.children = [imageWrapper, pCaption];
				node.data["hProperties"] = {
					...attributes,
					class: attributes.class ? `${attributes.class} md-embed` : "md-embed",
				};
			}
		});
	};
}
