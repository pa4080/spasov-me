"use client";
import React, { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileHtmlProps } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { ProjectData } from "@/interfaces/Project";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher } from "@/lib/md/process-markdown";
import { msgs } from "@/messages";

import { LabEntryData } from "@/interfaces/LabEntry";

import IconCircleWrapper from "../IconCircleWrapper";
import TooltipWrapper from "../TooltipWrapper";

interface Props {
	className?: string;
	gallery: FileHtmlProps[] | undefined;
	entryData: ProjectData | PostData | LabEntryData;
	current_carouselItem: number;
	carouselItems_count: number;
	counterAsText?: boolean;
	descriptionDisplay?: boolean;
	buttons_className?: string;
}

const GalleryCarouselNavEmbedded: React.FC<Props> = ({
	className,
	gallery,
	entryData,
	current_carouselItem,
	carouselItems_count,
	counterAsText = false,
	descriptionDisplay = true,
	buttons_className = "hover:text-background hover:bg-accent",
}) => {
	const t = msgs("Gallery");
	const collisionBoundaryRef = useRef<HTMLDivElement>(null);

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
					></div>
				))}
			</div>
		);

	return (
		<div
			className={cn(
				"w-full flex gap-4 sa:gap-2 justify-between items-center flex-col-reverse sa:flex-row mt-4 sa:mt-4 h-max",
				className
			)}
		>
			{/* Logo */}
			<TooltipWrapper tooltipText={entryData.html.title}>
				<IconCircleWrapper
					alt={entryData.title}
					className="min-w-[3.8rem] min-h-[3.8rem] drop-shadow-2xl"
					className_Image="size-12"
					src={
						entryData.html.icon?.metadata.html.fileUrl || entryData.html.icon?.metadata.html.fileUri
					}
					unoptimized={entryData.html.icon?.filename.match(/\.svg$/) ? true : false}
				/>
			</TooltipWrapper>

			{/* Description and Counter */}
			<div
				ref={collisionBoundaryRef}
				className="flex-grow h-full flex items-center justify-start flex-col prose prose-p:m-0 max-w-none"
			>
				{descriptionDisplay && gallery && current_carouselItem > 0 && haveDescription && (
					<div className="w-full h-full sa:-mt-2 sa:-mb-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger className="w-full">
									<div
										dangerouslySetInnerHTML={{
											__html: description,
										}}
										className="w-full sa:line-clamp-1 text-center"
									/>
								</TooltipTrigger>
								<TooltipContent
									className="border-2 border-muted-secondary dark:border-primary text-lg max-w-lg"
									collisionBoundary={collisionBoundaryRef?.current}
								>
									<p
										dangerouslySetInnerHTML={{
											__html: gallery[current_carouselItem - 1]?.description,
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

export default GalleryCarouselNavEmbedded;
