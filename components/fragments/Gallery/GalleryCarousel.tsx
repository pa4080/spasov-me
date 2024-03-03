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

import Navigation from "./GalleryCarouselNav";

interface Props {
	className?: string;
	gallery: FileHtmlProps[] | undefined;
	setIsOpen?: (arg: boolean) => void;
	counterAsText?: boolean;
	descriptionDisplay?: boolean;
}

const GalleryCarousel: React.FC<Props> = ({
	className,
	gallery,
	setIsOpen,
	counterAsText,
	descriptionDisplay,
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

	return (
		<Carousel
			className={cn(
				"flex-grow w-full flex flex-col items-center justify-center drop-shadow-2xl",
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
			<CarouselContent className="w-full items-center -ml-0.5 sa:-ml-4 h-full">
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
			<Navigation
				carouselItems_count={carouselItems_count}
				counterAsText={counterAsText}
				current_carouselItem={current_carouselItem}
				descriptionDisplay={descriptionDisplay}
				gallery={gallery}
				setIsOpen={setIsOpen}
			/>
		</Carousel>
	);
};

export default GalleryCarousel;
