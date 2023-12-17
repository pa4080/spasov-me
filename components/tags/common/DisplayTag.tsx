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

	return (
		<Image
			priority
			alt={icon?.name || "Icon"}
			className={className}
			height={size}
			src={
				theme === "dark"
					? icon?.uri?.dark || "/assets/icons/placeholder.svg"
					: icon?.uri?.light || "/assets/icons/placeholder.svg"
			}
			width={size * icon?.info?.ratio || size}
		/>
	);
};

export default DisplayTag;
