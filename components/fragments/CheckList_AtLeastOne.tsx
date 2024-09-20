import { useEffect } from "react";

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
	checklistItems: CheckListItem[];
	setChecklistItems: React.Dispatch<React.SetStateAction<CheckListItem[]>>;
	align?: "horizontal" | "vertical";
}

export default function CheckList_AtLeastOne({
	className,
	className_Checkbox = "h-5 w-5 border-[2px] dark:border-secondary dark:data-[state=checked]:bg-secondary data-[state=checked]:text-ring",
	checklistItems,
	setChecklistItems,
	align = "horizontal",
}: HorizontalChecklistProps) {
	useEffect(() => {
		// Ensure at least one item is selected on initial render
		const selectedCount = checklistItems.filter((item) => item.selected).length;

		if (selectedCount === 0) {
			const firstItem = checklistItems[0];

			setChecklistItems((prevData) => {
				return [
					{
						...firstItem,
						selected: true,
					},
					...prevData.slice(1),
				];
			});
		}
	}, [checklistItems, setChecklistItems]);

	const handleCheckboxChange = (key: string) => {
		const selectedCount = checklistItems.filter((item) => item.selected).length;

		if (checklistItems.find((item) => item.key === key)?.selected && selectedCount === 1) {
			// Prevent unselecting if it's the last selected item
			return;
		}

		setChecklistItems((prevData) => {
			return prevData.map((item) =>
				item.key === key ? { ...item, selected: !item.selected } : item
			);
		});
	};

	return (
		<div className={cn(align === "horizontal" ? "flex-row" : "flex-col", className)}>
			<div className={cn("flex gap-4", align === "horizontal" ? "flex-row" : "flex-col")}>
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
