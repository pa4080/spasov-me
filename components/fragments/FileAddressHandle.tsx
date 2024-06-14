"use client";
import React from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";

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

	return (
		<ButtonIcon
			className={cn("pl-[2.8px] bg-transparent hover:bg-transparent", className)}
			disabled={!addressNoVersion}
			height={22}
			type={download ? "download" : "up-right-from-square"}
			width={22}
			onClick={() => {
				if (!window || !addressNoVersion) {
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
			}}
		/>
	);
};

export default FileAddressHandle;
