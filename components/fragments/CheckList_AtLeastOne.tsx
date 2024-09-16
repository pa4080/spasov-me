import { useEffect } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn-utils";

export interface ChecklistItem {
	selected: boolean;
	label: string;
}

export interface ChecklistItems {
	[key: string]: ChecklistItem;
}

interface HorizontalChecklistProps {
	className?: string;
	className_Checkbox?: string;
	checklistItems: ChecklistItems;
	setChecklistItems: React.Dispatch<React.SetStateAction<ChecklistItems>>;
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
		const selectedCount = Object.values(checklistItems).filter((item) => item.selected).length;

		if (selectedCount === 0) {
			const firstKey = Object.keys(checklistItems)[0];

			setChecklistItems((prevData) => ({
				...prevData,
				[firstKey]: { ...prevData[firstKey], selected: true },
			}));
		}
	}, [checklistItems, setChecklistItems]);

	const handleCheckboxChange = (key: string) => {
		const selectedCount = Object.values(checklistItems).filter((item) => item.selected).length;

		if (checklistItems[key].selected && selectedCount === 1) {
			// Prevent unselecting if it's the last selected item
			return;
		}

		setChecklistItems((prevData) => ({
			...prevData,
			[key]: { ...prevData[key], selected: !prevData[key].selected },
		}));
	};

	return (
		<div className={cn(align === "horizontal" ? "flex-row" : "flex-col", className)}>
			<div className={cn("flex gap-4", align === "horizontal" ? "flex-row" : "flex-col")}>
				{Object.entries(checklistItems).map(([key, item]) => (
					<label
						key={key}
						className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
						htmlFor={key}
					>
						<Checkbox
							checked={item.selected}
							className={className_Checkbox}
							id={key}
							onCheckedChange={() => handleCheckboxChange(key)}
						/>
						{item.label}
					</label>
				))}
			</div>
		</div>
	);
}
