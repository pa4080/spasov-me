"use client";
import React, { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import styles from "../_about.module.scss";

interface Props {
	className?: string;
	target_id: string; // the Id of the container
	text: [string, string];
	tooltip?: boolean;
	type: "section" | "card" | "card-single-item";
}

/**
 * Here we are using few custom classes defined in _about.module.scss,
 * and generated into the related <Components />
 *
 * > card-item-collapsible - hides parts (items) of a card
 * > section-card-collapsible - hides an entire card
 *
 * > expand-collapsed - toggles the visibility of the card or card-item,
 *                      by adding it to the container
 *
 * > expand-collapsed-current - used to emphasize the current card...
 *                              closing other cards bring too much confusion
 *
 * > list-section - used to find the parent section and manipulate all cards in it,
 *                  also it is a helper class for the other kind of sections
 */
const ToggleCollapsible: React.FC<Props> = ({
	className,
	target_id,
	text = ["More", "Less"],
	tooltip,
	type,
}) => {
	const id = `#${target_id}`;
	const [isContentShown, setIsContentShown] = useState(false);
	const [targetContainer, setTargetContainer] = useState<Element | null>(null);

	const otherCardsActions = () => {
		if (type === "card" || type === "card-single-item") {
			const parentSection = targetContainer?.closest(".list-section");

			if (parentSection) {
				Array.from(parentSection.querySelectorAll(".expand-collapsed, .expand-collapsed-current"))
					?.filter((element) => element.id !== target_id)
					?.forEach((element) => {
						element.classList.remove("expand-collapsed-current");
						element.classList.remove("icon_accent_secondary");
						// We can change the state ot the other cards toggle buttons in this way...
						// element.querySelectorAll("svg").forEach((svg) => svg.classList.toggle("hidden"));
					});
			}
		}
	};

	useEffect(() => {
		const targetContainer = document.querySelector(id);

		if (targetContainer?.classList.contains("expand-collapsed")) {
			setIsContentShown(true);
		} else {
			setIsContentShown(false);
		}

		setTargetContainer(targetContainer);
	}, [id]);

	useEffect(() => {
		if (isContentShown) {
			setTimeout(() => {
				targetContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 10);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isContentShown]);

	const handleClick = (e: React.SyntheticEvent) => {
		e.preventDefault();

		targetContainer?.classList.toggle("expand-collapsed");
		otherCardsActions();

		if (targetContainer?.classList.contains("expand-collapsed")) {
			setIsContentShown(true);
		} else {
			setIsContentShown(false);
		}

		// Always highlight the last manipulated card
		if (type === "card") {
			targetContainer?.classList.add("expand-collapsed-current");
		} else if (type === "card-single-item") {
			targetContainer?.classList.add("expand-collapsed-current");
			targetContainer?.classList.add("icon_accent_secondary");
		}
	};

	switch (type) {
		case "card-single-item":
			return (
				<div className={className}>
					<button className={styles.classToggleIcon} onClick={handleClick}>
						<IconEmbedSvg type="angles-up-down" viewBoxHeight={16} viewBoxWidth={14} />
					</button>
				</div>
			);

		default:
			return (
				<div className={className}>
					{tooltip ? (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className={styles.classToggleIcon} onClick={handleClick}>
									<IconEmbedSvg
										className={isContentShown ? "hidden" : ""}
										type="angles-up-down"
										viewBoxHeight={16}
										viewBoxWidth={14}
									/>

									<IconEmbedSvg
										className={isContentShown ? "" : "hidden"}
										type="angles-up-up"
										viewBoxHeight={16}
										viewBoxWidth={14}
									/>
								</TooltipTrigger>
								<TooltipContent>{isContentShown ? text[0] : text[1]}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<div className={styles.classToggleText} onClick={handleClick}>
							{isContentShown ? text[1] : text[0]}
						</div>
					)}
				</div>
			);
	}
};

export default ToggleCollapsible;
