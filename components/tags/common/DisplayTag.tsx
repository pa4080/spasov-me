"use client";
import React from "react";

import Image from "next/image";

import { useTheme } from "next-themes";

import { IconMap } from "@/interfaces/IconMap";

interface Props {
	className?: string;
	icon: IconMap[string];
	size?: number;
}

const DisplayTag: React.FC<Props> = ({ className, icon, size = 22 }) => {
	const { theme } = useTheme();
	const height = size;
	const width = Math.ceil(height * icon?.info?.ratio) || height;

	return (
		<Image
			priority
			alt={icon?.name || "Icon"}
			className={className}
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
