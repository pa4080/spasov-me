import React from "react";

import { cn } from "@/lib/cn-utils";

import IconEmbedSvg, { IconEmbSvgPathType, IconEmbedSvgProps } from "./IconEmbedSvg";

export interface ButtonIconProps {
	className?: string;
	submitting?: boolean;
	label?: string;
	labelSubmitting?: string;
	onClick?: (e: React.SyntheticEvent) => void;
	type?: IconEmbSvgPathType;
	width?: number;
	height?: number;
	widthOffset?: number;
	heightOffset?: number;
	disabled?: boolean;
	iconEmbedSvgProps?: Omit<IconEmbedSvgProps, "type" | "width" | "height" | "alt" | "cursor">;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
	className,
	submitting,
	label = "Submit",
	labelSubmitting = "Submitting...",
	onClick,
	width = 20,
	height = 20,
	widthOffset = 12,
	heightOffset = 12,
	disabled = false,
	type = "rectangle-history-circle-plus",
	iconEmbedSvgProps,
}) => {
	const iconEmbedSvgPropsFinal = {
		...iconEmbedSvgProps,
		type: type as IconEmbSvgPathType,
		width,
		height,
		alt: submitting ? labelSubmitting : label,
		cursor: (disabled ? "not-allowed" : "pointer") as IconEmbedSvgProps["cursor"],
	};

	return (
		<div
			className={`${
				disabled
					? "cursor-not-allowed opacity-40 grayscale hover:grayscale"
					: "cursor-pointer grayscale hover:grayscale-0"
			} ${cn("flex items-center justify-center rounded-sm hover:bg-accent-secondary/40 bg-accent-secondary/20 hover:brightness-110 active:brightness-75 transition-colors duration-300", className)}`}
			style={{
				width: `${width + widthOffset}px`,
				height: `${height + heightOffset}px`,
			}}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				if (submitting || disabled) {
					return;
				}

				if (typeof onClick === "function") {
					onClick(e);
				}
			}}
		>
			<IconEmbedSvg {...iconEmbedSvgPropsFinal} />
		</div>
	);
};

export default ButtonIcon;
