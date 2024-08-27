"use client";
import React, { useState } from "react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";
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
		if (submitting) {
			return;
		}

		setSubmitting(true);

		navigator.clipboard.writeText(`${Route.public.ABOUT.uri}?id=entry_${entry_id}`);

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

export default CopyEntryUri;
