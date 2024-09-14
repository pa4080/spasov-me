"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileHtmlProps } from "@/interfaces/File";
import { LabEntryData } from "@/interfaces/LabEntry";
import { PostData } from "@/interfaces/Post";
import { ProjectData } from "@/interfaces/Project";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { LabEntryCustom } from "@/components/search/public";

import IconEmbedSvg from "../IconEmbedSvg";
import Loading from "../Loading";
// import GalleryCarousel from "./GalleryCarousel";

const GalleryCarousel = dynamic(() => import("./GalleryCarousel"), {
	ssr: false,
	loading: () => <Loading scale={3} />,
});

interface Props {
	className?: string;
	entry:
		| AboutEntryData
		| ProjectData
		| PostData
		| LabEntryData
		| LabEntryCustom
		| { title: string };
	gallery: FileHtmlProps[] | undefined;
	height?: number;
	width?: number;
	descriptionDisplay?: boolean;
}

const Gallery: React.FC<Props> = ({
	className,
	entry,
	gallery,
	height = 23,
	width = 23,
	descriptionDisplay,
}) => {
	const t = msgs("Gallery");

	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				className={cn(gallery?.length === 0 && "opacity-40 grayscale-[100%]", className)}
				disabled={!gallery?.length}
				id="gallery-open-button"
				onClick={() => setIsOpen(false)}
			>
				<IconEmbedSvg
					className={"grayscale-[100%] hover:grayscale-[0%]"}
					className_Path1="fill-accent-secondary"
					className_Path2="fill-accent"
					cursor={gallery?.length === 0 ? "not-allowed" : "pointer"}
					height={height}
					type="dice-d6"
					width={width}
				/>
			</DialogTrigger>
			<DialogContent
				className={cn(
					"sm:max-w-full md:!max-w-fit sa:max-w-lg sa:max-2xl:min-w-[calc(100vw-6rem)] 2xl:w-[1420px] 2xl:min-w-[1420px] sm:max-h-full sm:rounded-none h-full sa:max-h-[calc((var(--vh,1vh)_*_90))] sa:rounded-lg max-sa-min-w-[320px] min-h-[calc(100vh-4rem)] flex flex-col justify-normal gap-0 bg-background sa:border-border overflow-x-scroll 6xs:overflow-x-hidden w-full"
				)}
				closeOnOverlayClick={false}
			>
				<DialogDescription className="visually-hidden h-0 w-0 overflow-hidden opacity-0 absolute left-0 top-0">
					{t("dialog_title", { title: entry.title })}
				</DialogDescription>
				<DialogHeader>
					<div className="flex flex-col gap-1">
						<DialogTitle className="leading-normal line-clamp-1">
							{t("dialog_title", { title: entry.title })}
						</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description"),
								}}
							/>
						)}
					</div>
				</DialogHeader>

				<GalleryCarousel
					descriptionDisplay={descriptionDisplay}
					gallery={gallery}
					setIsOpen={setIsOpen}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default Gallery;
