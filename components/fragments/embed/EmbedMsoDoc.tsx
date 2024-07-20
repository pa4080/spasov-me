import React from "react";

const baseUrl: string = "https://view.officeapps.live.com/op/";

interface Props {
	sourceUrl: string;
	action?: "view" | "embed";
	style?: React.CSSProperties;
	className?: string;
}

const EmbedMsoDoc: React.FC<Props> = ({
	sourceUrl,
	action = "embed",
	style = { width: "100%", height: "100%" },
	className,
}) => {
	const srcUrl = baseUrl + action + ".aspx?src=" + sourceUrl;

	return (
		<div className={`embed-mso-doc-container ${className}`} style={style}>
			<iframe height="100%" src={srcUrl} width="100%" />
		</div>
	);
};

export default EmbedMsoDoc;
