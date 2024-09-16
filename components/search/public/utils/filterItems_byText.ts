import { hyphenateSync as hyphenate } from "hyphen/en";

import { UnitedEntryType } from "../type";

export interface FilterItemsByText {
	searchValue: string | undefined | null;
	items: UnitedEntryType[];
}

export function filterItems_byText({ searchValue, items }: FilterItemsByText) {
	if (!searchValue) {
		return items;
	}

	const searchValueSanitized = searchValue.trim();
	const searchValuePrepared = searchValueSanitized.replace(/\s+/g, ".*?");
	const searchValueHyphenated = hyphenate(searchValueSanitized).replace(/\s+/g, ".*?");

	const regExpSearch = new RegExp(`(\\b(${searchValuePrepared})\\b)`, "ig");
	const regExpHighligh = new RegExp(`(\\b(${searchValueHyphenated})\\b)`, "ig");

	return items
		.filter(
			(dataItem) => dataItem.title.match(regExpSearch) || dataItem.description.match(regExpSearch)
		)
		.map((dataItem) => ({
			...dataItem,
			html: {
				title: dataItem.html.title.replace(
					regExpHighligh,
					"<span class='search-result-match'>$1</span>"
				),
				description: dataItem.html.description.replace(
					regExpHighligh,
					"<span class='search-result-match'>$1</span>"
				),
			},
		}));
}
