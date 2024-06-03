"use client";
import React, { useEffect, useState } from "react";

import { FileData, FileHtmlProps } from "@/interfaces/File";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/cn-utils";

import { ProjectData } from "@/interfaces/Project";

import { Route } from "@/routes";

import DisplayFileImage from "../DisplayFileImage";
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
				// navType === "default" && "drop-shadow-2xl",
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
			<CarouselContent
				className={cn("w-full items-center ml-0 sa:-ml-2 flex-grow")}
				container_className={
					navType === "inProject"
						? "w-[100vw] max-w-[92vw] drop-shadow-2xl" // ? "w-[1280px] max-w-[92vw] drop-shadow-2xl"
						: "h-auto flex-grow flex drop-shadow-2xl"
				}
				container_style={
					{
						"--tw-drop-shadow":
							"drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2)) drop-shadow(0 3px 5px rgba(0, 0, 0, 0.12))",
					} as React.CSSProperties
				}
			>
				{gallery?.map((item, index) => {
					return (
						<CarouselItem
							key={index}
							className="w-full flex items-center justify-center pl-0.5 sa:pl-4 select-none"
						>
							<div
								className={cn(
									"this-container relative w-full mx-auto",
									navType === "inProject" ? "max-w-projectImageMaxWidth" : "max-w-[92vw]"
									// navType === "inProject" ? "max-w-[1248px]" : "max-w-[92vw]"
								)}
								style={{
									backgroundImage: `url(${Route.assets.LOGO_SVG})`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									backgroundSize: "200px",
									height: "100%",
								}}
							>
								<div
									className={cn(
										"relative w-full",
										navType === "inProject" ? "pb-[56.25%] h-0" : "h-full"
									)}
								>
									<div
										className={cn(
											"w-full h-full flex items-center justify-center",
											navType === "inProject" ? "absolute top-0 left-0" : ""
										)}
									>
										<DisplayFileImage
											className={cn(
												"rounded-md w-auto mx-auto h-auto",
												navType === "inProject" ? "" : "h-full max-h-[74vh]"
											)}
											file={
												{
													filename: item.filename,
													metadata: {
														html: item,
													},
												} as FileData
											}
											sizes={[
												"360px",
												"(max-width: 520px) 480px, (max-width: 640px) 560px, (max-width: 720px) 640px, (max-width: 920px) 820px, (max-width: 1024px) 940px, 1560px",
											]}
											// sizes={["360px", "1920px"]}
										/>
									</div>
								</div>
							</div>
						</CarouselItem>
					);
				})}
			</CarouselContent>
			{navPosition === "bottom" && <Nav />}
		</Carousel>
	);
};

export default GalleryCarousel;
