import EmbedMsoDoc from "@/components/fragments/embed/EmbedMsoDoc";
import EmbedPdfDoc from "@/components/fragments/embed/EmbedPdfDoc";
import React from "react";

const Portfolio: React.FC = () => {
	const srcUrl: string = "https://media.spasov.me/spas.spasov_accessKeys_aws.xlsx";

	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40 space-y-8">
			<div style={{ width: "100%", height: "520px" }} className="rounded-md overflow-hidden">
				<EmbedMsoDoc sourceUrl={srcUrl} style={{ height: "100.2%", width: "100.2%" }} />
			</div>
			<div style={{ width: "100%", height: "520px" }} className="rounded-md overflow-hidden">
				<EmbedPdfDoc
					sourceUrl="https://media.spasov.me/JOBS_English-2024-05-30.pdf?v=1717581660000"
					style={{ height: "100.2%", width: "100.2%" }}
				/>
			</div>
		</div>
	);
};

export default Portfolio;
