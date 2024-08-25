"use client";
import React from "react";

import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";

import IconEmbedSvg from "./IconEmbedSvg";

interface Props {
	className?: string;
	address: string;
	download?: boolean; // If true triggers download instead of opening in new tab
}

const FileAddressHandle: React.FC<Props> = ({ className, address, download }) => {
	const { session } = useAppContext();

	if (!session && !address) {
		return null;
	}

	const addressNoVersion = address?.split("?")[0];
	const disabled = !addressNoVersion;

	const handleResourceAddress = () => {
		if (!window || disabled) {
			return;
		}

		if (download) {
			const link = document.createElement("a");

			link.href = addressNoVersion;
			link.setAttribute("download", addressNoVersion?.split("/").at(-1) ?? "");
			link.setAttribute("target", "_blank");
			link.setAttribute("type", "application/octet-stream");
			document.body.appendChild(link);
			link.click();
			// link.remove();
		} else {
			addressNoVersion && window && window.open(addressNoVersion, "_blank");
		}
	};

	return (
		<div className={`transition-all duration-300`} onClick={handleResourceAddress}>
			<IconEmbedSvg
				className={cn(
					"grayscale-[100%] hover:grayscale-[0%] mt-0.5 mr-0.5",
					disabled ? "hover:grayscale-[100%] opacity-40" : "",
					className
				)}
				className_Path1="fill-accent"
				className_Path2="fill-accent-secondary"
				cursor={disabled ? "not-allowed" : "pointer"}
				height={21}
				type={download ? "download" : "arrow-up-right-from-square"}
				width={21}
			/>
		</div>
	);
};

export default FileAddressHandle;
