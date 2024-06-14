"use client";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { useAppContext } from "@/contexts/AppContext";
import { Route } from "@/routes";

export interface Props {
	className?: string;
	entry_id: string;
}

const CopyEntryUri: React.FC<Props> = ({ className, entry_id }) => {
	const [submitting, setSubmitting] = useState(false);
	const { session } = useAppContext();

	if (!entry_id || !session) {
		return null;
	}

	const handleCopyFileAddress = () => {
		setSubmitting(true);

		navigator.clipboard.writeText(`${Route.public.ABOUT.uri}?id=entry_${entry_id}`);

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

export default CopyEntryUri;
