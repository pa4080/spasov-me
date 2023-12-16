"use client";
import React from "react";

import Image from "next/image";

import { useTheme } from "next-themes";

import { cn } from "@/lib/cn-utils";

import { IconMap } from "@/interfaces/IconMap";

import styles from "../_about.module.scss";

interface Props {
	className?: string;
	icon: IconMap[string];
}

const DisplayTag: React.FC<Props> = ({ className, icon }) => {
	const { theme } = useTheme();

	return (
		<Image
			alt="Babel2"
			className={cn(styles.displayTag, className)}
			height={22}
			src={theme === "dark" ? icon.dark : icon.light}
			width={22}
		/>
	);
};

export default DisplayTag;
