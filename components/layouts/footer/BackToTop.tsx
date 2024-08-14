"use client";

import React, { useEffect, useRef } from "react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { cn } from "@/lib/cn-utils";

interface Props {
	className?: string;
}

const BackToTop: React.FC<Props> = ({ className }) => {
	const { isAboveSm } = useBreakpoint("sm");
	const distanceFromTop = 200;
	const btnRef = useRef<HTMLDivElement>(null);

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
		<div
			ref={btnRef}
			className={cn(
				// "ml:right-[calc(50vw-448px)]",
				"fixed -bottom-0.5 sm:bottom-0 right-1 sm:right-2 group flex items-center justify-center py-2 cursor-pointer rounded-md border border-transparent sm:hover:border-secondary/80 select-none transition-transform duration-300 w-8 sm:w-10 max-sm:hover:bg-primary/70",
				className
			)}
			style={{
				transform: "translateY(42px)",
				zIndex: 1000,
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
			<IconEmbedSvg className="-rotate-45 group-hover:hidden" type="rocket" />
			<IconEmbedSvg
				className="-rotate-45 hidden group-hover:block group-active:block"
				type="rocket-launch"
			/>
		</div>
	);
};

export default BackToTop;
