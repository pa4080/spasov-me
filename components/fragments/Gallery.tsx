"use client";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileData } from "@/interfaces/File";
import { msgs } from "@/messages";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";

interface Props {
	className?: string;
	entry: AboutEntryData;
}

const Gallery: React.FC<Props> = ({ className, entry }) => {
	const t = msgs("Gallery");

	const [isOpen, setIsOpen] = useState(false);

	let gallery = entry?.gallery?.map((file) => file.metadata.html);

	gallery =
		entry?.html?.attachment && gallery
			? [entry?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
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
		<div className={className}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={!gallery?.length}>
					<ButtonIcon
						className="px-0.5 bg-transparent icon_accent_secondary"
						disabled={!gallery?.length}
						height={22}
						type="folder-image"
						width={26}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent
					hideClose
					className="sm:max-w-full sm:max-h-full sm:rounded-none  sa:max-w-lg max-sa:h-full sa:max-h-[calc((var(--vh,1vh)_*_90))] sa:rounded-lg min-w-[320px] sa:min-w-[calc(100vw-6rem)] min-h-[calc(100vh-4rem)] flex flex-col gap-3 bg-background/60 sa:bg-background/20 sa:border-border/35 overflow-x-scroll 6xs:overflow-x-hidden"
					closeOnOverlayClick={false}
				>
					<DialogHeader displayClose className="mt-0">
						<DialogTitle className="max-w-[calc(100%-2rem)] leading-normal line-clamp-2">
							{t("dialog_title", { title: entry.title })}
						</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description"),
								}}
							/>
						)}
					</DialogHeader>

					<div className="flex flex-wrap flex-grow h-full flex-col items-center justify-between">
						<Carousel
							className="w-full sa:max-w-[calc(100%-6rem)] max-h-full h-[70vh] sm:h-[75vh] drop-shadow-2xl flex items-center max-sa:flex-col"
							setApi={setApi}
							style={
								{
									"--tw-drop-shadow": "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))",
								} as React.CSSProperties
							}
						>
							<CarouselContent className="w-full h-full items-center -ml-0.5 sa:-ml-4">
								{gallery?.map((item, index) => {
									return (
										<CarouselItem key={index} className="w-full h-fit pl-1 sa:pl-8 select-none">
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
							<div className="max-sa:relative max-sa:translate-y-[200%] max-sa:h-3 max-sa:flex max-sa:flex-row max-sa:ga-3">
								<CarouselPrevious className="scale-120" />
								<CarouselNext className="scale-120" />
							</div>
						</Carousel>
						<div className="w-full flex flex-row gap-2 justify-between items-end sa:items-center">
							{/* Submit button */}
							<Button className="hidden sa:block" type="button" onClick={() => setIsOpen(false)}>
								{t("dialog_btn_close")}
							</Button>
							{gallery && current > 0 && (
								<div
									dangerouslySetInnerHTML={{ __html: gallery[current - 1].description }}
									className="flex-shrink"
								></div>
							)}
							<div className="text-center text-sm text-muted-foreground min-w-20">
								{t("counter", { current, count })}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Gallery;
