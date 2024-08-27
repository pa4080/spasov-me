"use client";
import React, { useState } from "react";

import { cn } from "@/lib/cn-utils";

import IconEmbedSvg from "./IconEmbedSvg";

export interface Props {
	className?: string;
	address: string;
	children?: React.ReactNode;
}

const CopyFileAddressToClipboard: React.FC<Props> = ({ className, address, children }) => {
	const [popTimer, setPopTimer] = useState(false);

	if (!address) {
		return null;
	}

	const addressNoVersion = address?.split("?")[0];

	const handleCopyFileAddress = () => {
		setPopTimer(true);

		navigator.clipboard.writeText(`${addressNoVersion}`);

		setTimeout(() => {
			setPopTimer(false);
		}, 3000);
	};

	return (
		<div
			className={cn(
				"transition-all duration-300",
				popTimer ? "scale-120" : "",
				children ? className : "cursor-pointer"
			)}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				children && handleCopyFileAddress();
			}}
		>
			{children ? (
				children
			) : (
				<div onClick={handleCopyFileAddress}>
					<IconEmbedSvg
						className={cn("grayscale-[100%] hover:grayscale-[0%]", className)}
						className_Path1="fill-accent-secondary"
						className_Path2={popTimer ? "fill-foreground-secondary" : "fill-accent"}
						height={22}
						type={popTimer ? "clipboard-check" : "clipboard"}
						width={22}
					/>
				</div>
			)}
		</div>
	);
};

export default CopyFileAddressToClipboard;
