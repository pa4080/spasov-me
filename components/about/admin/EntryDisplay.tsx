import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import DisplayTagIcon from "@/components/tags/common/DisplayTagIcon";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import styles from "../_about.module.scss";
import EntryDelete from "./EntryDelete";
import EntryShowAttachment from "./EntryShowAttachment";
import EntryUpdate from "./EntryUpdate";

import { GenericActionProps } from ".";

interface Props extends Omit<GenericActionProps, "entryType" | "entry_id"> {}

const EntryDisplay: React.FC<Props> = ({ entry, className, files, tags }) => {
	const { dateFrom, dateTo } = entry;
	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;
	const descriptionArr = entry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	const t = msgs("AboutCV_Form");

	return (
		<div className={`${styles.card} ${styles.cardAdmin} ${className}`}>
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
							{format(dtFrom, "MMM.dd/", { locale: en })}
						</span>
						<span className={styles.lightPrimaryText}>
							{format(dtFrom, "yyyy", { locale: en })}
						</span>
					</span>
					<span className={styles.lightPrimaryText}>{" - "}</span>
					{dtTo ? (
						<span>
							<span className={styles.lightSecondaryText}>
								{format(dtTo, "MMM.dd/", { locale: en })}
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
				<div className={styles.lightPrimaryText + " line-clamp-1"}>
					{(t("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
					{(t("country_list") as unknown as Record<string, string>)[entry.country]}
				</div>
			</div>
			<div className={styles.content}>
				<div dangerouslySetInnerHTML={{ __html: entry.html.title }} className={styles.title} />
				<div className={styles.description}>
					<div dangerouslySetInnerHTML={{ __html: descriptionArr[0] ?? entry.description }} />
					{descriptionArr[1] && (
						<div
							dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
							className="card-item-collapsible"
						/>
					)}
					{entry.tags && (
						<div className="card-item-collapsible about-entry-tags">
							{entry.tags
								?.sort((a, b) =>
									a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
								)
								.map((tag) => (
									<DisplayTagIcon
										key={tag._id}
										description={tag.description}
										icon={iconsMap[tag.icon as IconsMapItem]}
									/>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EntryDisplay;
