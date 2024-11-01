import { type TagData } from "@/interfaces/Tag";

import { type UnitedEntryType } from "../type";

export interface FilterItemsByTag {
  tag?: TagData;
  tags: TagData[];
  selectedTagQuery: string | null;
  items: UnitedEntryType[];
}

export function filterItems_byTag({ tag, tags, selectedTagQuery, items }: FilterItemsByTag) {
  const searchedTag = tags.find(({ _id }) => _id === selectedTagQuery) ?? tag;

  const selectedTag = searchedTag
    ? {
        searchedTag,
        attachedToIds: searchedTag?.attachedTo?.map(({ _id }) => _id) ?? [],
      }
    : null;

  const result = items?.filter(({ _id }) => selectedTag?.attachedToIds.includes(_id));

  if (result && result.length > 0) {
    return result;
  } else {
    return items;
  }
}
