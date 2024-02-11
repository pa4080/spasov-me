"use client";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";

export interface Props {
	className?: string;
	uri: string;
}

const CopyFileUri: React.FC<Props> = ({ className, uri }) => {
	const [submitting, setSubmitting] = useState(false);

	const handleCopyFileUri = () => {
		setSubmitting(true);

		navigator.clipboard.writeText(`${uri}`);

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
				onClick={handleCopyFileUri}
			/>
		</div>
	);
};

export default CopyFileUri;
