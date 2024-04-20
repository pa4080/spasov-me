"use client";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";

export interface Props {
	className?: string;
	address: string;
}

const CopyFileAddress: React.FC<Props> = ({ className, address }) => {
	const [submitting, setSubmitting] = useState(false);

	const handleCopyFileAddress = () => {
		setSubmitting(true);

		navigator.clipboard.writeText(`${address}`);

		setTimeout(() => {
			setSubmitting(false);
		}, 3000);
	};

	return (
		<div className={`transition-all duration-300 ${submitting ? "scale-120" : ""}`}>
			<ButtonIcon
				className={`pl-[5px] bg-transparent icon_accent_secondary ${className}`}
				height={22}
				type={submitting ? "clipboard-check" : "clipboard"}
				width={22}
				onClick={handleCopyFileAddress}
			/>
		</div>
	);
};

export default CopyFileAddress;
