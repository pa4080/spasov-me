import React from "react";

import { getIconsMap } from "@/components/files-cloudflare/_files.actions";

import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { cn } from "@/lib/cn-utils";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import { getLabEntries } from "../_lab.actions";
import LabEntryPublic_Card from "./Card";

interface Props {
	className?: string;
	visibleItems?: number;
}

const LabEntriesPublic_EmbedList: React.FC<Props> = async ({ className, visibleItems = 2 }) => {
	const { labEntries, iconsMap } = await Promise.all([
		getLabEntries({
			hyphen: true,
			public: true,
		}),
		getIconsMap(),
	]).then(([labEntriesHyphenated, iconsMap]) => ({
		labEntries: labEntriesHyphenated?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime()),
		iconsMap,
	}));

	const t = msgs("LabEntries");
	const section_title = t("title_common");
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_lab_resources_portfolio_page`);

	return (
		<div
			className={cn("scroll-mt-16 list-section expand-collapsed", className)}
			id={toggle_target_id}
		>
			<SectionHeader className="pop-header" title={section_title}>
				<ToggleCollapsible
					invertButton
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>

			<div className="about-cards-section-items grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{labEntries?.map((labEntry, index) => (
					<LabEntryPublic_Card
						key={index}
						className={visibleItems > index ? "pop-item" : "section-card-collapsible pop-item"}
						iconsMap={iconsMap}
						labEntry={labEntry}
					/>
				))}
			</div>
		</div>
	);
};

export default LabEntriesPublic_EmbedList;
