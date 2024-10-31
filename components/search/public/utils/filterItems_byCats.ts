import { type CheckListItem } from "@/components/fragments/CheckList_AtLeastOne";

import { type UnitedEntryType } from "../type";

export interface CheckListItemModelType extends CheckListItem {
  modelType: "Project" | "LabEntry" | "AboutEntry" | "Post";
}

export interface FilterItemsByText {
  items: UnitedEntryType[];
  categories: CheckListItemModelType[];
}

export function filterItems_byCats({ categories, items }: FilterItemsByText) {
  if (!categories) {
    return items;
  }

  const selectedModelTypes = categories
    .filter(({ selected }) => selected)
    .map(({ modelType }) => modelType);

  if (selectedModelTypes.length === 0) {
    return items;
  }

  return items.filter(({ modelType }) => selectedModelTypes.includes(modelType));
}
