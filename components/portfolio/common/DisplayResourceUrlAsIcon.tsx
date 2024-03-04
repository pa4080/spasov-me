"use client";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { new_tab_target } from "@/lib/process-markdown";

interface Props {
	url: string | undefined;
	type: "home" | "repo";
	size?: number;
	icon_className_Path1?: string;
	icon_className_Path2?: string;
}

const DisplayResourceUrlAsIcon: React.FC<Props> = ({
	url,
	type,
	size = 24,
	icon_className_Path1 = "fill-inherit",
	icon_className_Path2 = "fill-inherit",
}) => {
	if (!url) {
		return null;
	}

	const icon =
		type === "home"
			? "globe-pointer-mono"
			: url.match(/github/i)
				? "square-github-mono"
				: url.match(/gitlab/i)
					? "square-gitlab-mono"
					: "git-alt-mono";

	const handleOnClick = () => {
		window.open(url, new_tab_target);
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="!mt-0" onClick={handleOnClick}>
					<IconEmbedSvg
						className_Path1={icon_className_Path1}
						className_Path2={icon_className_Path2}
						height={size}
						type={icon}
						width={size}
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
