"use client";
import React from "react";

import Image from "next/image";

import { useTheme } from "next-themes";

import { IconMap } from "@/interfaces/IconMap";

interface Props {
	className?: string;
	icon: IconMap[string];
}

const DisplayTag: React.FC<Props> = ({ className, icon }) => {
	const { theme } = useTheme();

	return (
		<Image
			priority
			alt={icon?.name || "Icon"}
			className={className}
			height={22}
			src={
				theme === "dark"
					? icon?.dark || "/assets/icons/placeholder.svg"
					: icon?.light || "/assets/icons/placeholder.svg"
			}
			width={22}
		/>
	);
};

export default DisplayTag;
