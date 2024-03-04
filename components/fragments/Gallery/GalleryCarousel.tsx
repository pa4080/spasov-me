"use client";
import React, { useEffect, useState } from "react";

import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import { FileData, FileHtmlProps } from "@/interfaces/File";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/cn-utils";

import { ProjectData } from "@/interfaces/Project";

import Navigation from "./GalleryCarouselNav";
import GalleryCarouselNavInProject from "./GalleryCarouselNavInProject";

interface Props {
	className?: string;
	gallery: FileHtmlProps[] | undefined;
	setIsOpen?: (arg: boolean) => void;
	counterAsText?: boolean;
	descriptionDisplay?: boolean;
	navPosition?: "top" | "bottom";
	navType?: "inProject" | "default";
	projectData?: ProjectData;
}

const GalleryCarousel: React.FC<Props> = ({
	className,
	gallery,
	setIsOpen,
	counterAsText,
	descriptionDisplay,
	navPosition = "bottom",
	navType = "default",
	projectData,
}) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current_carouselItem, setCurrent] = useState(0);
	const [carouselItems_count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	const Nav: React.FC = () => {
		return navType === "inProject" && projectData ? (
			<GalleryCarouselNavInProject
				carouselItems_count={carouselItems_count}
				counterAsText={counterAsText}
				current_carouselItem={current_carouselItem}
				descriptionDisplay={descriptionDisplay}
				gallery={gallery}
				projectData={projectData}
			/>
		) : (
			<Navigation
				carouselItems_count={carouselItems_count}
				counterAsText={counterAsText}
				current_carouselItem={current_carouselItem}
				descriptionDisplay={descriptionDisplay}
				gallery={gallery}
				setIsOpen={setIsOpen}
			/>
		);
	};

	return (
		<Carousel
			className={cn(
				"flex-grow w-full flex flex-col items-center justify-center",
				navType === "default" && "drop-shadow-2xl",
				className
			)}
			opts={{
				align: "start",
				loop: true,
			}}
			setApi={setApi}
			style={
				{
					"--tw-drop-shadow": "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))",
				} as React.CSSProperties
			}
		>
			{navPosition === "top" && <Nav />}
			<CarouselContent className="w-full items-center h-full -ml-[1px] sa:-ml-2">
				{/* -ml-0.5 sa:-ml-4 */}
				{gallery?.map((item, index) => {
					return (
						<CarouselItem
							key={index}
							className="w-full h-full flex items-center justify-center pl-0.5 sa:pl-4 select-none"
						>
							<DisplayFileImage
								className={`rounded-md h-auto w-auto max-h-[74vh] mx-auto`}
								file={
									{
										filename: item.filename,
										metadata: {
											html: item,
										},
									} as FileData
								}
								// sizes={["360px", "(max-width: 1024px) 980px, 1920px"]}
								sizes={["360px", "1920px"]}
							/>
						</CarouselItem>
					);
				})}
			</CarouselContent>
			{navPosition === "bottom" && <Nav />}
		</Carousel>
	);
};

export default GalleryCarousel;
