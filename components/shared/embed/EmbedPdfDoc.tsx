import React from "react";

interface Props {
  sourceUrl: string;
  style?: React.CSSProperties;
  className?: string;
}

const EmbedPdfDoc: React.FC<Props> = ({
  sourceUrl,
  style = { width: "100%", height: "100%" },
  className,
}) => {
  const srcUrl = sourceUrl;

  return (
    <div className={`embed-pdf-doc-container ${className}`} style={style}>
      <iframe height="100%" src={srcUrl} width="100%" />
    </div>
  );
};

export default EmbedPdfDoc;
