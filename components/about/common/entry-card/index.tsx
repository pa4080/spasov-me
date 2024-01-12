import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import ToggleCollapsible from "@/components/fragments/toggle-collapsible";
import DisplayTagIcon from "@/components/tags/common/DisplayTagIcon";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import DisplayAttachment from "../../../fragments/DisplayAttachment";
import EntryDelete from "../../admin/entry-actions/EntryDelete";
import EntryUpdate from "../../admin/entry-actions/EntryUpdate";
import styles from "./_entry-card.module.scss";

interface Props {
	className?: string;
	entry: AboutEntryData;
	files?: FileListItem[] | null | undefined;
	tags?: TagData[] | null | undefined;
	displayTags?: boolean;
	displayActions?: boolean;
}

const EntryCard: React.FC<Props> = ({
	entry,
	className,
	files,
	tags,
	displayTags = true,
	displayActions = false,
}) => {
	const tTime = msgs("AboutCV_Form");
	const tCommon = msgs("AboutCV");

	const { dateFrom, dateTo } = entry;
	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;
	const toggle_target_id = `entry_${entry?._id.toString()}`;
	const descriptionArr = entry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<div className={`${styles.cardWrapper} ${className}`} id={toggle_target_id}>
			<div className={`${styles.card}`}>
				<div className={styles.info}>
					<div className={styles.date}>
						<span>
							{/* <span className={styles.lightSecondaryText}>
							{format(dtFrom, "MM/", { locale: en })}
						</span> */}
							<span className={styles.lightPrimaryText}>
								{format(dtFrom, "yyyy", { locale: en })}
							</span>
						</span>
						<span className={styles.lightPrimaryText}>{" - "}</span>
						{dtTo ? (
							<span>
								{/* <span className={styles.lightSecondaryText}>
								{format(dtTo, "MM/", { locale: en })}
							</span> */}
								<span className={styles.lightPrimaryText}>
									{format(dtTo, "yyyy", { locale: en })}
								</span>
							</span>
						) : (
							<span className={styles.lightPrimaryText}>{tTime("dateTo_now_current")}</span>
						)}
					</div>
					<div className={styles.divider}>❘</div>
					<div className={`${styles.lightPrimaryText} ${styles.location}`}>
						{(tTime("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
						{(tTime("country_list") as unknown as Record<string, string>)[entry.country]}
					</div>
				</div>
				<div className={styles.header}>
					<div className={`${styles.buttons} ${displayActions ? "w-36" : "w-8"}`}>
						<div className={styles.buttonsContainer}>
							{displayActions && (
								<>
									<EntryDelete entry_id={entry._id} type={entry.entryType} />
									<DisplayAttachment uri={entry.html.attachmentUri} />
									<EntryUpdate entry={entry} files={files} tags={tags} type={entry.entryType} />
								</>
							)}
							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnMore"), tCommon("btnLess")]}
								type={descriptionArr[1] ? "card" : "card-single-item"}
							/>
						</div>
					</div>
					<div dangerouslySetInnerHTML={{ __html: entry.html.title }} className={styles.title} />
				</div>
				<div className={styles.description}>
					<div
						dangerouslySetInnerHTML={{ __html: descriptionArr[0] ?? entry.description }}
						className={descriptionArr[1] ? "card-item-static" : "card-single-item"}
					/>
					{descriptionArr[1] && (
						<div
							dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
							className="card-item-collapsible"
						/>
					)}
					{displayTags && (
						<div className="card-item-collapsible">
							<div className="about-entry-tags">
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
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default EntryCard;
