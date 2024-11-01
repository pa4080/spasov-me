/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Source: https://unifiedjs.com/explore/package/remark-directive/#unifieduseremarkdirective
import { visit } from "unist-util-visit";

import { processCaption } from "./utils";

// This plugin is an example to turn HTML5 `::video` into iframe.
// Invoke syntax:
// > ::video[Caption [url](#url) or <a href="#">link</a>]{#vid-id-1 href="https://image-url.com" ratioPercent="75%" maxWidth="100%"}
// > ::video[September 2009, [HES Plc](/about?id=entry_657aecaae0a4019cb3308bae)]{#vid-id-1 src="https://media.spasov.me/videos/spas-z-spasov-mechanical-engineering-001.webm" ratioPercent="67%" maxWidth="800px"}
export function myRemarkPlugin_Video() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any, file: { fail: (arg0: string, arg1: any) => void }) => {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        if (node.name !== "video") {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data = node.data || (node.data = {});
        const attrib = node.attributes || {};
        // const id = attrib.id;
        const { src, url, href, ratioPercent, maxWidth, ...attributes } = attrib;
        const videoSrc = src || url || href;
        const paddingTopRatioPercent = ratioPercent || `${(9 / 16) * 100}%`;
        const maxWidthValue = maxWidth || "100%";

        if (node.type === "textDirective") {
          file.fail("Unexpected `:pdf` text directive, use two colons for a leaf directive", node);
        }

        if (!videoSrc) {
          file.fail("Unexpected missing `src|url|href` on `pdf` directive", node);
        }

        const caption = processCaption({ items: node.children });

        const videoNode = {
          type: "video",
          tagName: "video",
          data: {
            hName: "video",
            hProperties: {
              width: "100%",
              height: "100%",
              src: videoSrc,
              controls: true,
              class: "md-embed-video",
            },
          },
        };

        const divNodeContainer = {
          type: "div",
          children: [videoNode],
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
              style:
                "margin: 0 auto;" + // we have spaces in this expression
                `
								position: relative;
								width: 100%;
								height: 100%;
								max-width: ${maxWidthValue};
								padding-top: ${paddingTopRatioPercent};
								`.replace(/\s+/g, ""),
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
