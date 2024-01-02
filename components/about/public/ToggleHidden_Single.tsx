"use client";
import React, { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import styles from "../_about.module.scss";

interface Props {
	className?: string;
	target_id: string;
	target_class?: string;
	text: [string, string];
	tooltip?: boolean;
}

const ToggleHidden_Single: React.FC<Props> = ({
	className,
	target_id,
	target_class,
	text = ["More", "Less"],
	tooltip,
}) => {
	const id = `#${target_id}`;
	const querySelector = target_class ? `#${target_id} .${target_class}` : `#${target_id}`;
	const [isContentHidden, setIsContentHidden] = useState(true);

	useEffect(() => {
		const targetToggle = document.querySelector(querySelector);

		if (targetToggle?.classList.contains("hidden")) {
			setIsContentHidden(true);
		} else {
			setIsContentHidden(false);
		}
	}, [querySelector]);

	const handleClick = (e: React.SyntheticEvent) => {
		e.preventDefault();

		const targetToggle = document.querySelector(querySelector);
		const targetScroll = document.querySelector(id);

		if (targetToggle?.classList.contains("hidden")) {
			targetScroll?.scrollIntoView({ behavior: "smooth", block: "start" });
			setIsContentHidden(false);
		} else {
			setIsContentHidden(true);
		}

		targetToggle?.classList.toggle("hidden");
	};

	return (
		<div className={`${styles.classToggleButton} ${className}`} onClick={handleClick}>
			{tooltip ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>{isContentHidden ? text[1] : text[0]}</TooltipTrigger>
						<TooltipContent>{isContentHidden ? text[0] : text[1]}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<>{isContentHidden ? text[0] : text[1]}</>
			)}
		</div>
	);
};

export default ToggleHidden_Single;
