"use client";
import React, { useEffect, useState } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

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
	className = "section-toggle-collapsible",
	target_id,
	text = ["More", "Less"],
	tooltip,
	type,
}) => {
	const id = `#${target_id}`;
	const [isContentShown, setIsContentShown] = useState(false);
	const [targetContainer, setTargetContainer] = useState<Element | null>(null);

	const classToggleIcon =
		"cursor-pointer uppercase font-unicephalon w-10 h-10 rounded-full flex items-center " +
		"justify-center text-foreground-secondary bg-primary hover:bg-background " +
		"transition-colors duration-300 border-primary border-4";

	const classToggleText =
		"cursor-pointer uppercase font-unicephalon tracking-wider py-2 px-5 " +
		"rounded-full text-foreground-secondary bg-primary transition-colors duration-300 " +
		"hover:bg-foreground-secondary hover:text-background whitespace-nowrap " +
		"-ml-8 2xs:ml-2 mt-1 2xs:-mt-0.5 -mb-4 2xs:mb-0";

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
		const thisTargetContainer = targetContainer ?? document.querySelector(id);

		if (thisTargetContainer?.classList.contains("expand-collapsed")) {
			setIsContentShown(true);
		} else {
			setIsContentShown(false);
		}

		setTargetContainer(thisTargetContainer);
	}, [id, targetContainer]);

	useEffect(() => {
		const thisTargetContainer = targetContainer ?? document.querySelector(id);

		if (isContentShown) {
			setTimeout(() => {
				thisTargetContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 10);
		}

		setTargetContainer(thisTargetContainer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isContentShown]);

	const handleClick = (e?: React.SyntheticEvent) => {
		e && e.preventDefault();

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
					{tooltip ? (
						<button className={classToggleIcon} onClick={handleClick}>
							<IconEmbedSvg type="angles-up-down" viewBoxHeight={16} viewBoxWidth={14} />
						</button>
					) : (
						<div className={classToggleText} onClick={handleClick}>
							{isContentShown ? text[1] : text[0]}
						</div>
					)}
				</div>
			);

		default:
			return (
				<div className={className}>
					{tooltip ? (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className={classToggleIcon} onClick={handleClick}>
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
								<TooltipContent>{isContentShown ? text[1] : text[0]}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<div className={classToggleText} onClick={handleClick}>
							{isContentShown ? text[1] : text[0]}
						</div>
					)}
				</div>
			);
	}
};

export default ToggleCollapsible;
