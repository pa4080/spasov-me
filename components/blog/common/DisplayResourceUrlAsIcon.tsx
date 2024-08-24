/**
 * TODO: This components is almost the same as the one used in the Portfolio. We should unify them.
 */
"use client";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn-utils";
import { new_tab_target } from "@/lib/process-markdown";
import { msgs } from "@/messages";

interface Props {
	url: string | undefined;
	type: "URL 1" | "URL 2";
	size?: number;
	width?: number;
	height?: number;
	icon_className_Path1?: string;
	icon_className_Path2?: string;
	className?: string;
}

const DisplayResourceUrlAsIcon: React.FC<Props> = ({
	url,
	type,
	size = 24,
	width = 24,
	height = 24,
	icon_className_Path1 = "fill-inherit",
	icon_className_Path2 = "fill-inherit",
	className,
}) => {
	if (!url) {
		return null;
	}

	const t = msgs("Posts_CardPublic");
	const w = width || size;
	const h = height || size;

	const handleOnClick = () => {
		window.open(url, new_tab_target);
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					aria-label={t("tooltip_link", { linkType: type })}
					className={cn("!mt-0", className)}
					onClick={handleOnClick}
				>
					<IconEmbedSvg
						className_Path1={icon_className_Path1}
						className_Path2={icon_className_Path2}
						height={h}
						type={"link"}
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
