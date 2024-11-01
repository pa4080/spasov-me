export interface SampleLink {
  type: "link";
  title: string;
  url: string;
  children: [{ type: "text"; value: string }];
}

export type Item = { type: "text" | "html"; value: string } | SampleLink;

export interface NodeCaption {
  items: Item[];
}

/**
 * console.log(node);
 * ::youtube[Redux... <a href="#">ln_1</a> ... [ln 2](# "TITLE")]{#5yEG6GhoJBs}
{
	type: 'leafDirective',
	name: 'youtube',
	attributes: { id: '5yEG6GhoJBs' },
	children: [
		{	type: 'text',	value: 'Redux...', position: [Object] },
		{ type: 'html', value: '<a href="#">', position: [Object] },
		{ type: 'text', value: 'ln_1', position: [Object] },
		{ type: 'html', value: '</a>', position: [Object] },
		{ type: 'text', value: ' ... ', position: [Object] },
		{
			type: 'link',
			title: "TITLE",
			url: '#',
			children: [ { type: 'text', value: 'test', position: [Object] } ],
			position: {
				start: { line: 11, column: 78, offset: 441 },
				end: { line: 11, column: 87, offset: 450 }
			}
		}
	],
	position: {
		start: { line: 11, column: 1, offset: 364 },
		end: { line: 11, column: 118, offset: 481 }
	},
	data: {}
}
*/

export function processCaption({ items: children }: NodeCaption) {
  return children
    .reduce((acc: string, item: { type: "text" | "html"; value: string } | SampleLink) => {
      if (item.type === "link") {
        const link = item;
        let html = "";

        if (link.title) {
          html = `<a href="${link.url}">${link.title} ${link.children[0].value}</a>`;
        } else {
          html = `<a href="${link.url}">${link.children[0].value}</a>`;
        }

        return acc + html;
      }

      return acc + item.value;
    }, "")
    .replace(/\s+/g, " ")
    .trim();
}
