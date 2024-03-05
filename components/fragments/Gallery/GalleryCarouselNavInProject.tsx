"use client";
import React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import Image from "next/image";

import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FileHtmlProps } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import TooltipWrapper from "../TooltipWrapper";

interface Props {
	className?: string;
	gallery: FileHtmlProps[] | undefined;
	projectData: ProjectData;
	current_carouselItem: number;
	carouselItems_count: number;
	counterAsText?: boolean;
	descriptionDisplay?: boolean;
	buttons_className?: string;
}

const GalleryCarouselNavInProject: React.FC<Props> = ({
	className,
	gallery,
	projectData: project,
	current_carouselItem,
	carouselItems_count,
	counterAsText = false,
	descriptionDisplay = true,
	buttons_className = "hover:text-background hover:bg-accent",
}) => {
	const t = msgs("Gallery");

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
					"flex gap-2 xs:gap-3 justify-center sa:translate-y-2 flex-grow flex-wrap",
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
			<TooltipWrapper tooltipText={project.html.title}>
				<div
					className="rounded-full overflow-clip bg-primary/80 min-w-[3.8rem] min-h-[3.8rem] flex items-center justify-center drop-shadow-2xl z-10"
					style={
						{
							"--tw-drop-shadow": "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))",
						} as React.CSSProperties
					}
				>
					<Image
						alt={project.title}
						className="size-12"
						height={44}
						src={project.html.icon?.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER}
						width={44}
					/>
				</div>
			</TooltipWrapper>

			{/* Description and Counter */}
			<div className="flex-grow h-full flex items-center justify-start flex-col prose prose-p:m-0 max-w-none">
				{descriptionDisplay && gallery && current_carouselItem > 0 && (
					<div className="w-full h-full sa:-mt-2">
						<p
							dangerouslySetInnerHTML={{ __html: gallery[current_carouselItem - 1]?.description }}
							className="w-full sa:line-clamp-1 text-center"
						/>
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

export default GalleryCarouselNavInProject;
