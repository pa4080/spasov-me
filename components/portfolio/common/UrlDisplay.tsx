"use client";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import { new_tab_target } from "@/lib/process-markdown";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

const ResourceUrlDisplayAsIcon: React.FC<{ url: string | undefined; type: "home" | "repo" }> = ({
	url,
	type,
}) => {
	if (!url) {
		return null;
	}

	const icon =
		type === "home"
			? "ui_domain-www-icon"
			: url.match(/github/i)
				? "it_github"
				: url.match(/gitlab/i)
					? "it_gitlab"
					: "it_git-icon";

	const handleOnClick = () => {
		window.open(url, new_tab_target);
	};

	return (
		<DisplayIcon
			className_TooltipTrigger="!mt-0 opacity-75"
			description={url}
			icon={iconsMap[icon as IconsMapItem]}
			onClick={handleOnClick}
		/>
	);
};

export default ResourceUrlDisplayAsIcon;
