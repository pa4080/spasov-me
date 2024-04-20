"use client";
import React from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";

interface Props {
	className?: string;
	uri: string;
	download?: boolean; // If true triggers download instead of opening in new tab
}

const FileUriHandle: React.FC<Props> = ({ className, uri, download }) => {
	return (
		<ButtonIcon
			className={`pl-[2.8px] bg-transparent icon_accent_secondary ${className}`}
			disabled={!uri}
			height={22}
			type={download ? "download" : "up-right-from-square"}
			width={22}
			onClick={() => {
				if (!window || !uri) {
					return;
				}

				if (download) {
					const link = document.createElement("a");

					link.href = uri;
					link.setAttribute("download", "");
					document.body.appendChild(link);
					link.click();
					link.remove();
				} else {
					uri && window && window.open(uri, "_blank");
				}
			}}
		/>
	);
};

export default FileUriHandle;
