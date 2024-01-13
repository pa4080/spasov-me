import React from "react";

import Image from "next/image";

import { FileData } from "@/interfaces/File";
import { Route } from "@/routes";

interface Props {
	className?: string;
	file: FileData;
}

const DisplayFileImage: React.FC<Props> = ({ className, file }) =>
	file.filename.match(/\.(pdf|pptx|xlsx|docx)$/) ? (
		<Image
			priority
			alt={file.filename}
			className={className}
			height="0"
			sizes="160px"
			src={`${Route.assets.MIME_TYPE}/${file.filename.split(".").pop()}.png`}
			width="0"
		/>
	) : (
		<Image
			priority
			alt={file.filename}
			className={className}
			height="0"
			sizes="320px"
			src={file.metadata.html.fileUri}
			width="0"
		/>
	);

export default DisplayFileImage;
