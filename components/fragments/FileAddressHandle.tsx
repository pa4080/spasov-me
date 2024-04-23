"use client";
import React from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";

interface Props {
	className?: string;
	address: string;
	download?: boolean; // If true triggers download instead of opening in new tab
}

const FileAddressHandle: React.FC<Props> = ({ className, address, download }) => {
	return (
		<ButtonIcon
			className={`pl-[2.8px] bg-transparent icon_accent_secondary ${className}`}
			disabled={!address}
			height={22}
			type={download ? "download" : "up-right-from-square"}
			width={22}
			onClick={() => {
				if (!window || !address) {
					return;
				}

				if (download) {
					const link = document.createElement("a");

					link.href = address;
					link.setAttribute("download", address?.split("/").at(-1) ?? "");
					link.setAttribute("target", "_blank");
					link.setAttribute("type", "application/octet-stream");
					document.body.appendChild(link);
					link.click();
					// link.remove();
				} else {
					address && window && window.open(address, "_blank");
				}
			}}
		/>
	);
};

export default FileAddressHandle;
