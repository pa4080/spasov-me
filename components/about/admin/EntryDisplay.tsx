import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

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

	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;

	const t = msgs("AboutCV_Form");

	return (
		<div className={cn(styles.card, styles.editModeCard, className)}>
			<div className={styles.cardEditActions}>
				<EntryDelete entryType={entry.entryType} entry_id={entry._id} />
				<EntryShowAttachment uri={entry.html.attachmentUri} />
				<EntryUpdate entry={entry} entryType={entry.entryType} files={files} />
			</div>
			<div className={styles.metaInfo}>
				<div className={styles.date}>
					{/* {format(new Date(dateFrom), "MMMM yyyy", { locale: en })} */}
					{/* {format(new Date(dateFrom), "yyyy/MM", { locale: en })} */}
					<span>
						<span className={styles.lightSecondaryText}>
							{format(dtFrom, "MM/", { locale: en })}
						</span>
						<span className={styles.lightPrimaryText}>
							{format(dtFrom, "yyyy", { locale: en })}
						</span>
					</span>
					<span className={styles.lightPrimaryText}>{" - "}</span>
					{dtTo ? (
						<span>
							<span className={styles.lightSecondaryText}>
								{format(dtTo, "MM/", { locale: en })}
							</span>
							<span className={styles.lightPrimaryText}>
								{format(dtTo, "yyyy", { locale: en })}
							</span>
						</span>
					) : (
						<span className={styles.lightPrimaryText}>{t("dateTo_now_current")}</span>
					)}
				</div>
				<div className={styles.divider}>:</div>
				<div className={styles.lightPrimaryText}>
					{(t("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
					{(t("country_list") as unknown as Record<string, string>)[entry.country]}
				</div>
			</div>
			<div className="col-2">
				<div dangerouslySetInnerHTML={{ __html: title }} className={styles.title} />
				<div dangerouslySetInnerHTML={{ __html: description }} className={styles.description} />
			</div>
		</div>
	);
};

export default EntryDisplay;
