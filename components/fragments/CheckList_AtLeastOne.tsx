import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn-utils";

export interface CheckListItem {
	key: string;
	label: string;
	selected: boolean;
}

interface HorizontalChecklistProps {
	className?: string;
	className_Checkbox?: string;
	className_List?: string;
	checklistItems: CheckListItem[];
	setChecklistItems: (items: CheckListItem[]) => void;
	align?: "horizontal" | "vertical";
}

export default function CheckList_AtLeastOne({
	className,
	className_Checkbox = "h-5 w-5 border-[2px] dark:border-secondary dark:data-[state=checked]:bg-secondary data-[state=checked]:text-ring",
	className_List = "",
	align = "horizontal",
	checklistItems,
	setChecklistItems,
}: HorizontalChecklistProps) {
	const handleCheckboxChange = (key: string) => {
		const selectedCount = checklistItems.filter((item) => item.selected).length;

		// Prevent unselecting if it's the last selected item
		if (checklistItems.find((item) => item.key === key)?.selected && selectedCount === 1) {
			return setChecklistItems(checklistItems);
		}

		setChecklistItems(
			checklistItems.map((item) =>
				item.key === key ? { ...item, selected: !item.selected } : item
			)
		);
	};

	return (
		<div className={cn(align === "horizontal" ? "flex-row" : "flex-col", className)}>
			<div
				className={cn(
					"flex gap-4",
					align === "horizontal" ? "flex-row" : "flex-col",
					className_List
				)}
			>
				{checklistItems.map((item) => (
					<label
						key={item.key}
						className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
						htmlFor={item.key}
					>
						<Checkbox
							checked={item.selected}
							className={className_Checkbox}
							id={item.key}
							onCheckedChange={() => handleCheckboxChange(item.key)}
						/>
						{item.label}
					</label>
				))}
			</div>
		</div>
	);
}
