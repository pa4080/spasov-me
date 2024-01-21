import React from "react";

import Image from "next/image";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileData } from "@/interfaces/File";
import { Route } from "@/routes";

interface Props {
	className?: string;
	className_TooltipTrigger?: string;
	file: FileData;
	sizes?: [string, string];
	description?: string;
}

const DisplayFileImage: React.FC<Props> = ({
	className,
	className_TooltipTrigger,
	file,
	sizes = ["160px", "320px"],
	description,
}) => {
	const TheImage = file.filename.match(/\.(pdf|pptx|xlsx|docx)$/) ? (
		<Image
			priority
			alt={file.filename}
			className={className}
			height="0"
			sizes={sizes?.[0] || "160px"}
			src={`${Route.assets.MIME_TYPE}/${file.filename.split(".").pop()}.png`}
			width="0"
		/>
	) : (
		<Image
			priority
			alt={file.filename}
			className={className}
			height="0"
			sizes={sizes?.[1] || "320px"}
			src={file.metadata.html.fileUri}
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

export default DisplayFileImage;
