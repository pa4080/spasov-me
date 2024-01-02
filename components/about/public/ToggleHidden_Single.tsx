"use client";
import React, { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import styles from "../_about.module.scss";

interface Props {
	className?: string;
	target_id: string; // the Id of the container
	target_class: string; // the Class of the collapsible items
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
		const targetToggle = document.querySelectorAll(querySelector);

		if (targetToggle?.[0].classList.contains("hidden")) {
			setIsContentHidden(true);
		} else {
			setIsContentHidden(false);
		}
	}, [querySelector]);

	useEffect(() => {
		const targetScroll = document.querySelector(id);

		if (!isContentHidden) {
			setTimeout(() => {
				targetScroll?.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 100);
		}
	}, [id, isContentHidden]);

	const handleClick = (e: React.SyntheticEvent) => {
		e.preventDefault();

		const targetToggle = document.querySelectorAll(querySelector);

		if (targetToggle?.[0].classList.contains("hidden")) {
			setIsContentHidden(false);
		} else {
			setIsContentHidden(true);
		}

		targetToggle?.forEach((target) => target.classList.toggle("hidden"));
	};

	return (
		<div className={className}>
			{tooltip ? (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className={styles.classToggleIcon} onClick={handleClick}>
							{isContentHidden ? (
								<IconEmbedSvg type="angles-up-down" viewBoxHeight={16} viewBoxWidth={14} />
							) : (
								<IconEmbedSvg type="angles-up-up" viewBoxHeight={16} viewBoxWidth={14} />
							)}
						</TooltipTrigger>
						<TooltipContent>{isContentHidden ? text[0] : text[1]}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				<div className={styles.classToggleText} onClick={handleClick}>
					{isContentHidden ? text[0] : text[1]}
				</div>
			)}
		</div>
	);
};

export default ToggleHidden_Single;
