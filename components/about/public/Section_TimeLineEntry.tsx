import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import DisplayTagIcon from "@/components/tags/common/DisplayTagIcon";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import styles from "../_about.module.scss";
import ToggleHidden_Single from "./ToggleHidden_Single";

export interface Props {
	className?: string;
	entry: AboutEntryData;
}

const DisplayEntry: React.FC<Props> = ({ entry, className }) => {
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
		<div className={`${styles.cardPublicWrapper} ${className}`} id={toggle_target_id}>
			<div className={`${styles.card} ${styles.cardPublic}`}>
				<div className={styles.metaInfo}>
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
					<div className={styles.divider}>:</div>
					<div className={`${styles.lightPrimaryText} ${styles.location}`}>
						{(tTime("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
						{(tTime("country_list") as unknown as Record<string, string>)[entry.country]}
					</div>
				</div>
				<div className={styles.content}>
					<div>
						<div className={styles.cardButtons}>
							<ToggleHidden_Single
								tooltip
								className="icon_accent_primary"
								target_class="item-collapsible"
								target_id={toggle_target_id}
								text={[tCommon("btnMore"), tCommon("btnLess")]}
							/>
						</div>
						<div dangerouslySetInnerHTML={{ __html: entry.html.title }} className={styles.title} />
					</div>
					<div className={styles.description}>
						<div dangerouslySetInnerHTML={{ __html: descriptionArr[0] ?? entry.description }} />
						{descriptionArr[1] && (
							<div
								dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
								className="item-collapsible hidden"
							/>
						)}
						{entry.tags && (
							<div className="item-collapsible hidden">
								<div className="about-entry-tags">
									{entry.tags
										?.sort((a, b) =>
											a.orderKey
												? a.orderKey.localeCompare(b.orderKey)
												: a.name.localeCompare(b.name)
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
		</div>
	);
};

export default DisplayEntry;
