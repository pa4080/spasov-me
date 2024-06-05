import React from "react";

const baseUrl: string = "https://view.officeapps.live.com/op/";

interface Props {
	sourceUrl: string;
	style?: React.CSSProperties;
	className?: string;
}

const EmbedTxtDoc: React.FC<Props> = ({
	sourceUrl,
	style = { width: "100%", height: "100%" },
	className,
}) => {
	return (
		<div style={style} className={`embed-mso-doc-container ${className}`}>
			<object height="100%" width="100%" data={sourceUrl} />
		</div>
	);
};

export default EmbedTxtDoc;
