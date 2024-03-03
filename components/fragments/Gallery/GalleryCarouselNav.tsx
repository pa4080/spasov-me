"use client";
import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FileHtmlProps } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

interface Props {
	className?: string;
	gallery: FileHtmlProps[] | undefined;
	current_carouselItem: number;
	carouselItems_count: number;
	setIsOpen?: (arg: boolean) => void;
	counterAsText?: boolean;
	descriptionDisplay?: boolean;
	buttons_className?: string;
}

const Navigation: React.FC<Props> = ({
	className,
	gallery,
	current_carouselItem,
	carouselItems_count,
	setIsOpen,
	counterAsText = false,
	descriptionDisplay = true,
	buttons_className = "hover:text-background hover:bg-ring-secondary",
}) => {
	const t = msgs("Gallery");

	return (
		<div className={cn("w-full flex flex-wrap gap-2 justify-between items-end", className)}>
			{/* Close button */}
			{setIsOpen && (
				<Button
					className={cn("hidden sa:block", buttons_className)}
					type="button"
					onClick={() => setIsOpen(false)}
				>
					{t("dialog_btn_close")}
				</Button>
			)}

			{/* Description and Counter */}
			<div className="flex-grow">
				{descriptionDisplay && gallery && current_carouselItem > 0 && (
					<p
						dangerouslySetInnerHTML={{ __html: gallery[current_carouselItem - 1].description }}
						className="w-full line-clamp-1 text-center text-foreground"
					/>
				)}
				{counterAsText ? (
					<div className="text-center text-sm text-primary min-w-20">
						{t("counter", { current: current_carouselItem, count: carouselItems_count })}
					</div>
				) : (
					<div className="flex gap-3 w-full items-end justify-center mt-1">
						{Array.from({ length: carouselItems_count }).map((_, index) => (
							<div
								key={index}
								className={cn("size-3 rounded-full transition-colors duration-150", {
									"bg-foreground": index + 1 === current_carouselItem,
									"bg-secondary": index + 1 !== current_carouselItem,
								})}
							></div>
						))}
					</div>
				)}
			</div>

			{/* Next/Previous buttons and Counter */}
			<div className="flex gap-3">
				<CarouselPrevious
					unstyled
					className={buttons_className}
					icon={{
						Icon: ChevronLeft,
						className: "size-8",
					}}
					variant="default"
				/>
				<CarouselNext
					unstyled
					className={buttons_className}
					icon={{
						Icon: ChevronRight,
						className: "size-8",
					}}
					variant="default"
				/>
			</div>
		</div>
	);
};

export default Navigation;
