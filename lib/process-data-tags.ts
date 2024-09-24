import { NewTagData, TagData, TagDoc } from "@/interfaces/Tag";
import { AttachedToDocument, TagType } from "@/interfaces/_common-data-types";

import { processMarkdown } from "./md/process-markdown";

export function tagDocuments_toData({
	tags,
	hyphen = true,
	visible,
	sorted = true,
}: {
	tags: TagDoc[];
	hyphen?: boolean;
	visible?: boolean;
	sorted?: boolean;
}): TagData[] {
	let tagsFiltered = tags;

	if (visible) {
		tagsFiltered = tags.filter(({ tagType }) => tagType !== "system");
	}

	if (sorted) {
		tagsFiltered = tagsFiltered.sort((a, b) =>
			a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
		);
	}

	return tagsFiltered.map((tag) => ({
		_id: tag._id.toString(),
		name: tag.name,
		description: tag.description,
		icon: tag.icon,
		tagType: tag.tagType,
		orderKey: tag.orderKey,
		attachedTo: tag.attachedTo,
		html: {
			description: processMarkdown({
				markdown: tag.description,
				hyphen,
			}),
		},
	}));
}

export function tagFormData_toNewTagData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewTagData {
	return {
		name: data.get("name") as string,
		description: data.get("description") as string,
		icon: data.get("icon") as string,
		tagType: data.get("tagType") as TagType,
		orderKey: data.get("orderKey") as string,
		attachedTo: JSON.parse(data.get("attachedTo") as string) as AttachedToDocument[],

		creator: user_id,
	};
}
