"use client";
import React, { useState } from "react";

import { cn } from "@/lib/cn-utils";

import IconEmbedSvg from "./IconEmbedSvg";

export interface Props {
	className?: string;
	address: string;
}

const CopyFileAddressToClipboard: React.FC<Props> = ({ className, address }) => {
	const [submitting, setSubmitting] = useState(false);

	if (!address) {
		return null;
	}

	const addressNoVersion = address?.split("?")[0];

	const handleCopyFileAddress = () => {
		setSubmitting(true);

		navigator.clipboard.writeText(`${addressNoVersion}`);

		setTimeout(() => {
			setSubmitting(false);
		}, 3000);
	};

	return (
		<div
			className={`transition-all duration-300 ${submitting ? "scale-120" : ""}`}
			onClick={handleCopyFileAddress}
		>
			<IconEmbedSvg
				className={cn("grayscale-[100%] hover:grayscale-[0%]", className)}
				className_Path1="fill-accent-secondary"
				className_Path2={submitting ? "fill-secondary" : "fill-accent"}
				height={22}
				type={submitting ? "clipboard-check" : "clipboard"}
				width={22}
			/>
		</div>
	);
};

export default CopyFileAddressToClipboard;
