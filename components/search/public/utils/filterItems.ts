import { hyphenateSync as hyphenate } from "hyphen/en";

import { UnitedEntryType } from "../type";

export interface FilterItems {
	searchValue: string | undefined | null;
	dataList: UnitedEntryType[];
}
export function filterItems({ searchValue, dataList }: FilterItems) {
	if (!searchValue) {
		return dataList;
	}

	const searchValueSanitized = searchValue.trim();
	const searchValuePrepared = searchValueSanitized.replace(/\s+/g, ".*?");
	const searchValueHyphenated = hyphenate(searchValueSanitized).replace(/\s+/g, ".*?");

	const regExpSearch = new RegExp(`(\\b(${searchValuePrepared})\\b)`, "i");
	const regExpHighligh = new RegExp(`(\\b(${searchValueHyphenated})\\b)`, "i");

	return dataList
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
