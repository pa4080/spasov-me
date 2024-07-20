import React from "react";

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
		<div className={`embed-mso-doc-container ${className}`} style={style}>
			<object data={sourceUrl} height="100%" width="100%" />
		</div>
	);
};

export default EmbedTxtDoc;
