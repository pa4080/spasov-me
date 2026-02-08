import { type TagData } from "@/interfaces/Tag";

import { type UnitedEntryType } from "../type";

export interface FilterItemsByTag {
  tags: TagData[];
  selectedTagIds: string[];
  items: UnitedEntryType[];
}

export function filterItems_byTag({ tags, selectedTagIds, items }: FilterItemsByTag) {
  if (selectedTagIds.length === 0) {
    return items;
  }

  // Collect all attachedTo IDs from all selected tags (union)
  const attachedToIds = new Set<string>();

  for (const tagId of selectedTagIds) {
    const tag = tags.find(({ _id }) => _id === tagId);

    if (tag?.attachedTo) {
      for (const { _id } of tag.attachedTo) {
        attachedToIds.add(_id);
      }
    }
  }

  if (attachedToIds.size === 0) {
    return items;
  }

  const result = items.filter(({ _id }) => attachedToIds.has(_id));

  return result.length > 0 ? result : items;
}
