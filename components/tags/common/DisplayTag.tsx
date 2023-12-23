"use client";
import React from "react";

import Image from "next/image";

import { useTheme } from "next-themes";

import { IconMap } from "@/interfaces/IconMap";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
	className?: string;
	icon: IconMap[string];
	size?: number;
	description?: string;
}

const DisplayTag: React.FC<Props> = ({ className, icon, size = 30, description }) => {
	const { theme } = useTheme();
	const height = size;
	const width = Math.ceil(height * icon?.info?.ratio) || height;

	const classNameGenerated = `hover:bg-muted-secondary dark:hover:bg-primary-foreground/20 py-1 px-1 transition-colors hover:transition-colors duration-200 rounded-sm hover:saturate-150 ${className}`;

	if (description) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Image
							priority
							alt={icon?.name || "Icon"}
							className={classNameGenerated}
							// border border-transparent hover:bg-secondary hover:border-muted-secondary
							height={height}
							src={
								theme === "dark"
									? icon?.uri?.dark || "/assets/icons/placeholder.svg"
									: icon?.uri?.light || "/assets/icons/placeholder.svg"
							}
							style={{ width, height, minWidth: height }}
							width={width}
						/>
					</TooltipTrigger>
					<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
						<p>{description}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<Image
			priority
			alt={icon?.name || "Icon"}
			className={classNameGenerated}
			height={height}
			src={
				theme === "dark"
					? icon?.uri?.dark || "/assets/icons/placeholder.svg"
					: icon?.uri?.light || "/assets/icons/placeholder.svg"
			}
			style={{ width, height }}
			width={width}
		/>
	);
};

export default DisplayTag;
