"use client";
import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileHtmlProps } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher } from "@/lib/md/process-markdown";
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

	const description = gallery?.[current_carouselItem - 1]?.description?.replace(
		commentsMatcher,
		""
	);

	const haveDescription = description && description !== "";

	const Counter: React.FC<{ className?: string }> = ({ className }) =>
		counterAsText ? (
			<div
				className={cn("flex text-sm text-foreground-secondary justify-center flex-grow", className)}
			>
				{t("counter", { current: current_carouselItem, count: carouselItems_count })}
			</div>
		) : (
			<div
				className={cn(
					"flex gap-2 xs:gap-3 justify-center sa:translate-y-2 flex-grow flex-wrap items-center",
					className
				)}
			>
				{Array.from({ length: carouselItems_count }).map((_, index) => (
					<div
						key={index}
						className={cn("size-2 xs:size-3 rounded-full transition-colors duration-150", {
							"bg-foreground": index + 1 === current_carouselItem,
							"bg-secondary": index + 1 !== current_carouselItem,
						})}
					/>
				))}
			</div>
		);

	return (
		<div
			className={cn(
				"w-full flex gap-4 sa:gap-2 justify-between items-center flex-col sa:flex-row",
				className
			)}
		>
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
			<div className="flex-grow h-full flex items-center justify-center flex-col prose prose-p:m-0 prose-p:-mt-1 max-w-none">
				{descriptionDisplay && gallery && current_carouselItem > 0 && haveDescription && (
					<div className="w-full h-full">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="w-full">
									<div
										dangerouslySetInnerHTML={{
											__html: gallery[current_carouselItem - 1]?.description,
										}}
										className="w-full sa:line-clamp-1 text-center"
									/>
								</TooltipTrigger>
								<TooltipContent className="border-2 border-muted-secondary dark:border-primary text-lg max-w-lg">
									<p
										dangerouslySetInnerHTML={{
											__html: description,
										}}
										className="w-full text-center"
									/>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)}

				<Counter className="hidden sa:flex" />
			</div>

			{/* Next/Previous buttons and Counter */}
			<div className="flex gap-3 items-center w-full sa:w-auto">
				<CarouselPrevious
					unstyled
					className={buttons_className}
					icon={{
						Icon: ChevronLeft,
						className: "size-8",
					}}
					variant="default"
				/>
				<Counter className="flex sa:hidden" />
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
