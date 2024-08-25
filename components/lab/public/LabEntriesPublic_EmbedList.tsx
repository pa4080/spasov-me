import React from "react";

import { getIconsMap } from "@/components/files-cloudflare/_files.actions";

import { getLabEntries } from "../_lab.actions";
import LabEntryPublic_Card from "./Card";

interface Props {
	className?: string;
}

const LabEntriesPublic_EmbedList: React.FC<Props> = async () => {
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

	return (
		<>
			{labEntries?.map((labEntry, index) => (
				<LabEntryPublic_Card key={index} className="" iconsMap={iconsMap} labEntry={labEntry} />
			))}
		</>
	);
};

export default LabEntriesPublic_EmbedList;
