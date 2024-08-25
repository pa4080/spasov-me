"use client";

import IconEmbedSvg, { IconEmbSvgPathType } from "@/components/fragments/IconEmbedSvg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn-utils";
import { new_tab_target } from "@/lib/process-markdown";

interface Props {
	iconType: IconEmbSvgPathType;
	size?: number;
	width?: number;
	height?: number;
	icon_className_Path1?: string;
	icon_className_Path2?: string;
	className?: string;
	isClickable?: boolean;
	label: string;
	url: string | undefined;
}

const DisplayResourceUrlAsIcon: React.FC<Props> = ({
	iconType,
	size = 23,
	width = 23,
	height = 23,
	icon_className_Path1 = "fill-inherit",
	icon_className_Path2 = "fill-inherit",
	className,
	isClickable = true,
	label,
	url,
}) => {
	if (!url) {
		return null;
	}

	const w = width || size;
	const h = height || size;

	const handleOnClick = () => {
		isClickable && window.open(url, new_tab_target);
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					aria-label={label || "Link"}
					className={cn("!mt-0", className)}
					onClick={handleOnClick}
				>
					<IconEmbedSvg
						className="cursor-not-allowed"
						className_Path1={icon_className_Path1}
						className_Path2={icon_className_Path2}
						height={h}
						type={iconType}
						width={w}
					/>
				</TooltipTrigger>
				<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
					<div dangerouslySetInnerHTML={{ __html: `${label}: <br/>${url}` }} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default DisplayResourceUrlAsIcon;
