import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import { msgs } from "@/messages";

import { TagList } from "@/interfaces/Tag";

import DisplayTag from "@/components/tags/common/DisplayTag";

import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import styles from "../_about.module.scss";
import EntryDelete from "./EntryDelete";
import EntryShowAttachment from "./EntryShowAttachment";
import EntryUpdate from "./EntryUpdate";
import { FileListItem } from "./entry-form";
import { Entry_FormSchema } from "./entry-form/schema";

const splitDescriptionKeyword = /<!--\s*more\s*-->/;

interface Props {
	entry: Omit<Entry_FormSchema, "tags"> & {
		html: { title: string; description: string; attachmentUri?: string };
		_id: string;
		tags: TagList;
	};
	className?: string;
	files?: FileListItem[];
	tags: TagList;
}

const EntryDisplay: React.FC<Props> = ({ entry, className, files, tags }) => {
	const {
		dateFrom,
		dateTo,
		html: { title, description },
	} = entry;

	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;

	const descriptionArr = description.split(splitDescriptionKeyword);

	const t = msgs("AboutCV_Form");

	return (
		<div className={`${styles.card} ${styles.editModeCard} ${className}`}>
			<div className={styles.cardEditActions}>
				<EntryDelete entryType={entry.entryType} entry_id={entry._id} />
				<EntryShowAttachment uri={entry.html.attachmentUri} />
				<EntryUpdate entry={entry} entryType={entry.entryType} files={files} tags={tags} />
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
				<div className={`about-entry-description ${styles.description}`}>
					<div dangerouslySetInnerHTML={{ __html: descriptionArr[0] ?? description }} />
					<div className="about-entry-collapsible">
						{descriptionArr[1] && (
							<div
								dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
								className="about-entry-collapsible-text"
							/>
						)}
						<div className="about-entry-tags">
							{entry.tags
								?.sort((a, b) => a.name.localeCompare(b.name))
								.map((tag) => (
									<DisplayTag
										key={tag._id}
										description={tag.description}
										icon={iconsMap[tag.icon as IconsMapItem]}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EntryDisplay;
