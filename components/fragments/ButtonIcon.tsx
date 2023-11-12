import React from "react";

import { cn } from "@/lib/cn-utils";

import IconEmbedSvg, { IconEmbSvgPathType } from "./IconEmbedSvg";

interface Props {
	className?: string;
	submitting?: boolean;
	label?: string;
	labelSubmitting?: string;
	onClick?: (e: React.SyntheticEvent) => void;
	c1?: string;
	c2?: string;
	op1?: string;
	op2?: string;
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
	c1 = "mlt-purple-bright",
	c2 = "mlt-purple-bright",
	op1,
	op2,
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
				c1={c1}
				c2={c2}
				height={height}
				op1={op1}
				op2={op2}
				type={type}
				width={width}
			/>
		</div>
	);
};

export default ButtonIcon;
