import React from "react";

import { cn } from "@/lib/cn-utils";

import IconEmbedSvg, { IconEmbSvgPathType } from "./IconEmbedSvg";

interface Props {
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
}

const ButtonIcon: React.FC<Props> = ({
	className,
	submitting,
	label = "Submit",
	labelSubmitting = "Submitting...",
	onClick,
	type = "rectangle-history-circle-plus",
	width = 20,
	height = 20,
	widthOffset = 12,
	heightOffset = 12,
}) => {
	return (
		<div
			className={cn(
				"flex items-center justify-center cursor-pointer",
				"rounded-sm hover:bg-mlt-gray-2/10 bg-mlt-gray-2/5 grayscale hover:grayscale-0 hover:brightness-110 active:brightness-75 transition-colors duration-300",
				className
			)}
			style={{
				width: `${width + widthOffset}px`,
				height: `${height + heightOffset}px`,
			}}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				if (submitting) {
					return;
				}

				if (typeof onClick === "function") {
					onClick(e);
				}
			}}
		>
			<IconEmbedSvg
				alt={submitting ? labelSubmitting : label}
				height={height}
				type={type}
				width={width}
			/>
		</div>
	);
};

export default ButtonIcon;
