import EmbedMsoDoc from "@/components/fragments/embed/EmbedMsoDoc";
import EmbedPdfDoc from "@/components/fragments/embed/EmbedPdfDoc";
import EmbedTxtDoc from "@/components/fragments/embed/EmbedTxtDoc";
import React from "react";

const Portfolio: React.FC = () => {
	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40 space-y-8">
			<div
				style={{ width: "100%", height: "520px" }}
				className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
			>
				<EmbedTxtDoc
					sourceUrl="https://media.spasov.me/test-text.txt"
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

			<div
				style={{ width: "100%", height: "520px" }}
				className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
			>
				<EmbedMsoDoc
					sourceUrl="https://media.spasov.me/template-time-price-estimation.xlsx"
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

			<div
				style={{ width: "100%", height: "520px" }}
				className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
			>
				<EmbedPdfDoc
					sourceUrl="https://media.spasov.me/JOBS_English-2024-05-30.pdf"
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
		</div>
	);
};

export default Portfolio;
