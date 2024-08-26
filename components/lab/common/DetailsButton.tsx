"use client";
import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { Route } from "@/routes";

interface Props {
	className?: string;
	slug: string;
}

const DetailsButton: React.FC<Props> = ({ className, slug }) => {
	const t = msgs("Posts_CardPublic");

	return (
		<Link
			aria-label={t("area_label_card_link")}
			className={className}
			href={`${Route.public.LAB.uri}/${slug}`}
		>
			<Button
				className={cn("transition-colors duration-300 hover:duration-150")}
				size="sm"
				variant="defaultSecondary"
			>
				{t("button_call_to_action")}
			</Button>
		</Link>
	);
};

export default DetailsButton;
