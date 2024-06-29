"use client";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { cn } from "@/lib/cn-utils";

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
				children ? className : "cursor-pointer",
				children ? className : ""
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
				<ButtonIcon
					className={cn(
						"pl-[5px] bg-transparent icon_accent_secondary",
						!children ? className : ""
					)}
					height={22}
					type={popTimer ? "clipboard-check" : "clipboard"}
					width={22}
					onClick={handleCopyFileAddress}
				/>
			)}
		</div>
	);
};

export default CopyFileAddressToClipboard;
