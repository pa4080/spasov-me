import React from "react";

const baseUrl: string = "https://view.officeapps.live.com/op/";

interface Props {
	sourceUrl: string;
	action?: "view" | "embed";
	style?: React.CSSProperties;
	className?: string;
}

const EmbedPdfDoc: React.FC<Props> = ({
	sourceUrl,
	action = "embed",
	style = { width: "100%", height: "100%" },
	className,
}) => {
	const srcUrl = sourceUrl;

	return (
		<div style={style} className={`embed-pdf-doc-container ${className}`}>
			<iframe height="100%" width="100%" src={srcUrl} />
		</div>
	);
};

export default EmbedPdfDoc;
