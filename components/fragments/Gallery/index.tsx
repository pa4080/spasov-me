"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";

import ButtonIcon, { ButtonIconProps } from "@/components/fragments/ButtonIcon";
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
import { ProjectData } from "@/interfaces/Project";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { useAppContext } from "@/contexts/AppContext";

import { IconEmbSvgPathType } from "../IconEmbedSvg";
import Loading from "../Loading";
// import GalleryCarousel from "./GalleryCarousel";

const GalleryCarousel = dynamic(() => import("./GalleryCarousel"), {
	ssr: false,
	loading: () => <Loading scale={3} />,
});

interface Props {
	className?: string;
	entry: AboutEntryData | ProjectData;
	gallery: FileHtmlProps[] | undefined;
	dialogTrigger_buttonIconProps?: ButtonIconProps;
}

const Gallery: React.FC<Props> = ({ className, entry, gallery, dialogTrigger_buttonIconProps }) => {
	const t = msgs("Gallery");

	const { session } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);

	if (!gallery?.length && !session) {
		return null;
	}

	const buttonIconPropsFinal = {
		className: "px-0.5 bg-transparent icon_accent_secondary",
		disabled: !gallery?.length,
		height: 22,
		type: "folder-image" as IconEmbSvgPathType,
		width: 26,
		onClick: () => setIsOpen(true),
		...dialogTrigger_buttonIconProps,
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger disabled={!gallery?.length}>
				<ButtonIcon {...buttonIconPropsFinal} />
			</DialogTrigger>
			<DialogContent
				hideClose
				className={cn(
					"sm:max-w-full sm:max-h-full sm:rounded-none sa:max-w-lg h-full sa:max-h-[calc((var(--vh,1vh)_*_90))] sa:rounded-lg min-w-[320px] sa:min-w-[calc(100vw-6rem)] min-h-[calc(100vh-4rem)] flex flex-col justify-normal gap-0 bg-background sa:border-border overflow-x-scroll 6xs:overflow-x-hidden",
					className
				)}
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

				<GalleryCarousel gallery={gallery} setIsOpen={setIsOpen} />
			</DialogContent>
		</Dialog>
	);
};

export default Gallery;
