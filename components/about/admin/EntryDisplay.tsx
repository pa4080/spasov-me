import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS } from "date-fns/locale";

import { cn } from "@/lib/cn-utils";

import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import EntryDelete from "./EntryDelete";
import EntryShowAttachment from "./EntryShowAttachment";
import EntryUpdate from "./EntryUpdate";
import { FileListItem } from "./entry-form";
import { Entry_FormSchema } from "./entry-form/schema";

interface Props {
	entry: Entry_FormSchema & {
		html: { title: string; description: string; attachmentUri?: string };
		_id: string;
	};
	className?: string;
	files?: FileListItem[];
}

const EntryDisplay: React.FC<Props> = ({ entry, className, files }) => {
	const {
		dateFrom,
		dateTo,
		html: { title, description },
	} = entry;

	const dFrom = new Date(dateFrom);
	const dTo = dateTo ? new Date(dateTo) : undefined;

	const t = msgs("AboutCV_Form");

	return (
		<div className={cn(styles.card, className)}>
			<div className={styles.cardEditActions}>
				<EntryDelete entryType={entry.entryType} entry_id={entry._id} />
				<EntryShowAttachment uri={entry.html.attachmentUri} />
				<EntryUpdate entry={entry} entryType={entry.entryType} files={files} />
			</div>
			<div className="col-1">
				<div className="date">
					{/* {format(new Date(dateFrom), "MMMM yyyy", { locale: en })} */}
					{/* {format(new Date(dateFrom), "yyyy/MM", { locale: en })} */}
					<span className="opacity-50">{format(dFrom, "MM/", { locale: enUS })}</span>
					<span className="opacity-80">{format(dFrom, "yyyy", { locale: enUS })}</span>
					<span className="opacity-80">{" - "}</span>
					{dTo ? (
						<>
							<span className="opacity-50">{format(dTo, "MM/", { locale: enUS })}</span>
							<span className="opacity-80">{format(dTo, "yyyy", { locale: enUS })}</span>
						</>
					) : (
						<span className="opacity-80">{t("dateTo_now_current")}</span>
					)}
				</div>
				<div className="location opacity-80">
					{(t("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
					{(t("country_list") as unknown as Record<string, string>)[entry.country]}
				</div>
			</div>
			<div className="col-2">
				<div dangerouslySetInnerHTML={{ __html: title }} />
				<div dangerouslySetInnerHTML={{ __html: description }} />
			</div>
		</div>
	);
};

export default EntryDisplay;
