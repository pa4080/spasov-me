"use client";

import React, { useEffect, useRef } from "react";

import { Tooltip } from "@radix-ui/react-tooltip";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

interface Props {
	className?: string;
}

const BackToTop: React.FC<Props> = ({ className }) => {
	const t = msgs("Footer");
	const { isAboveSm } = useBreakpoint("sm");
	const distanceFromTop = 200;
	const btnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const btn = btnRef.current;
		const content = document.querySelector("#content main");

		if (!btn || !content) {
			return;
		}

		const showHideScrollButton_BelowSm = (e: Event) => {
			const element = e.target as Document;

			if (element) {
				if (window.scrollY > distanceFromTop) {
					btn.style.transform = "translateY(-8px)";
				} else {
					btn.style.transform = "translateY(42px)";
				}
			}
		};

		const showHideScrollButton_AboveSm = (e: Event) => {
			const element = e.target as HTMLElement;

			if (element) {
				if (element.scrollTop > distanceFromTop) {
					btn.style.transform = "translateY(-8px)";
				} else {
					btn.style.transform = "translateY(42px)";
				}
			}
		};

		window.addEventListener("scroll", showHideScrollButton_BelowSm);
		content?.addEventListener("scroll", showHideScrollButton_AboveSm);

		return () => {
			window.removeEventListener("scroll", showHideScrollButton_BelowSm);
			content?.removeEventListener("scroll", showHideScrollButton_AboveSm);
		};
	}, []);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					ref={btnRef}
					className={cn(
						// "ml:right-[calc(50vw-448px)]",
						"fixed -bottom-0.5 sm:bottom-0 right-1 sm:right-2 group flex items-center justify-center cursor-pointer rounded-md border border-transparent sm:hover:border-secondary/80 select-none transition-all duration-300 w-8 sm:w-10 max-sm:hover:bg-primary/70",
						className
					)}
					style={{
						transform: "translateY(42px)",
						zIndex: 15,
					}}
					onClick={(e) => {
						e.stopPropagation();

						const target = document.querySelector("#scroll-to-top");
						const navbar = document.querySelector("#top-navbar");

						if (target && isAboveSm) {
							target.scrollIntoView({ behavior: "smooth" });
						} else if (navbar) {
							navbar.scrollIntoView({ behavior: "smooth" });
						}
					}}
				>
					<div className="relative w-10 h-10">
						<IconEmbedSvg
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-1 group-hover:opacity-0 transition-opacity group-hover:duration-500 duration-300 z-2"
							type="rocket"
						/>
						<IconEmbedSvg
							className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity group-hover:duration-300 duration-500 z-1"
							type="rocket-launch"
						/>
					</div>
				</TooltipTrigger>
				<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
					{t("btn_backToTop")}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default BackToTop;
