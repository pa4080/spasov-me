import React from "react";

import { cn } from "@/lib/cn-utils";

import { labEntryPropertyTuple } from "@/interfaces/_common-data-types";

import { getIconsMap } from "@/components/files-cloudflare/_files.actions";

import { getLabEntries } from "../_lab.actions";
import Section from "./Section";

interface Props {
	className?: string;
}

const LabPublic: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([
		getLabEntries({
			hyphen: true,
			public: true,
		}),
		getIconsMap(),
	]).then(([labEntriesHyphenated, iconsMap]) => ({
		labEntries: labEntriesHyphenated,
		iconsMap,
	}));

	return (
		<div className={cn("space-y-20", className)}>
			{labEntryPropertyTuple.map((type) => (
				<Section key={type} {...data} labEntryPropertyType={type} />
			))}
		</div>
	);
};

export default LabPublic;
