"use client";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppContext } from "@/contexts/AppContext";
import { LabEntryData } from "@/interfaces/LabEntry";
import { cn } from "@/lib/cn-utils";
import { new_tab_target } from "@/lib/process-markdown";
import { msgs } from "@/messages";

interface Props {
	labEntry: LabEntryData;
	type: "Home Page" | "Add next...";
	size?: number;
	width?: number;
	height?: number;
	icon_className_Path1?: string;
	icon_className_Path2?: string;
	className?: string;
}

const DisplayResourceUrlAsIcon: React.FC<Props> = ({
	labEntry,
	type,
	size = 24,
	width = 24,
	height = 24,
	icon_className_Path1 = "fill-inherit",
	icon_className_Path2 = "fill-inherit",
	className,
}) => {
	const { session } = useAppContext();
	const url = labEntry?.urlHome;

	if (!url) {
		return null;
	}

	const t = msgs("LabEntries_CardPublic");
	const w = width || size;
	const h = height || size;

	const handleOnClick = () => {
		window.open(url, new_tab_target);
	};

	return labEntry.visibilityType === "private" && !session ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					aria-label={t("tooltip_home_link_private")}
					className={cn("!mt-0", className)}
				>
					<IconEmbedSvg
						className="cursor-not-allowed"
						className_Path1={icon_className_Path1}
						className_Path2={icon_className_Path2}
						height={h}
						type={"lock-keyhole"}
						width={w}
					/>
				</TooltipTrigger>
				<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
					{t("tooltip_home_link_private")}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	) : (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					aria-label={t("tooltip_home_link", { linkType: type })}
					className={cn("!mt-0", className)}
					onClick={handleOnClick}
				>
					<IconEmbedSvg
						className_Path1={icon_className_Path1}
						className_Path2={icon_className_Path2}
						height={h}
						type={"globe-pointer"}
						width={w}
					/>
				</TooltipTrigger>
				<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
					<div dangerouslySetInnerHTML={{ __html: url }} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default DisplayResourceUrlAsIcon;
