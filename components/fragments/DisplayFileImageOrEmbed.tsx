import React from "react";

import Image from "next/image";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileData } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";

import EmbedMsoDoc from "./embed/EmbedMsoDoc";
import EmbedPdfDoc from "./embed/EmbedPdfDoc";
import EmbedTxtDoc from "./embed/EmbedTxtDoc";

interface Props {
	className?: string;
	className_TooltipTrigger?: string;
	file: FileData;
	sizes?: [string, string];
	description?: string;
	style?: React.CSSProperties;
}

const DisplayFileImageOrEmbed: React.FC<Props> = ({
	className,
	className_TooltipTrigger,
	file,
	sizes = ["160px", "320px"],
	description,
	style,
}) => {
	if (!file || !file.filename) {
		return null;
	}

	const TheImage = file.filename.match(/\.(pdf)$/) ? (
		<div
			className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
			style={{ width: "100%", height: "100%" }}
		>
			<EmbedPdfDoc
				sourceUrl={
					file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
				}
				style={{
					height: "calc(100% + 2px)",
					width: "calc(100% + 2px)",
					marginLeft: "-1px",
					marginTop: "-1px",
					borderRadius: "1px",
					overflow: "hidden",
				}}
			/>
		</div>
	) : file.filename.match(/\.(txt|csv)$/) ? (
		<div
			className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
			style={{ width: "100%", height: "100%" }}
		>
			<EmbedTxtDoc
				sourceUrl={
					file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
				}
				style={{
					height: "calc(100% + 2px)",
					width: "calc(100% + 2px)",
					marginLeft: "-1px",
					marginTop: "-1px",
					borderRadius: "1px",
					overflow: "hidden",
				}}
			/>
		</div>
	) : file.filename.match(/\.(pptx|xlsx|docx)$/) ? (
		<div
			className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
			style={{ width: "100%", height: "100%" }}
		>
			<EmbedMsoDoc
				sourceUrl={
					file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
				}
				style={{
					height: "calc(100% + 2px)",
					width: "calc(100% + 2px)",
					marginLeft: "-1px",
					marginTop: "-1px",
					borderRadius: "1px",
					overflow: "hidden",
				}}
			/>
		</div>
	) : file.filename.match(/\.(svg|png|jpg|avif|jpeg|webp|jfif|bmp)$/) ? (
		<Image
			priority
			alt={file.filename}
			className={cn("h-auto w-full  max-h-[76vh]", className)}
			height="0"
			sizes={sizes?.[1] || "320px"}
			src={
				file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
			}
			style={style}
			unoptimized={file.filename?.match(/\.svg$/) ? true : false}
			width="0"
		/>
	) : (
		<Image
			priority
			alt={file.filename}
			className={cn("h-auto w-full", className)}
			height="0"
			sizes={sizes?.[0] || "160px"}
			src={`${Route.assets.MIME_TYPE}/${file.filename.split(".").pop()}.png`}
			style={style}
			width="0"
		/>
	);

	if (description) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className={className_TooltipTrigger}>{TheImage}</TooltipTrigger>
					<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
						<p>{description}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return TheImage;
};

export default DisplayFileImageOrEmbed;
