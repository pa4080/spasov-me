import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import styles from "@/app/(styles)/card-info.module.scss";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import Gallery from "@/components/fragments/Gallery";
import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";
import { Route } from "@/routes";

interface ProjectDataExtended extends ProjectData {
	city?: string;
	country?: string;
}

interface AboutEntryDataExtended extends AboutEntryData {
	slug?: string;
}

interface Props {
	className?: string;
	entry: AboutEntryDataExtended | ProjectDataExtended;
	files?: FileListItem[] | null | undefined;
	tags?: TagData[] | null | undefined;
	displayTagsInline?: boolean;
	displayGalleryInline?: boolean;
}

const AboutEntryCard: React.FC<Props> = ({ entry, className, displayTagsInline = true }) => {
	const tTime = msgs("AboutEntries_Form");
	const tCommon = msgs("Search");

	const { dateFrom, dateTo } = entry;
	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`entry_${entry?._id.toString()}`);
	const descriptionArr = entry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	const classToggleIcon =
		"cursor-pointer uppercase font-unicephalon w-10 h-10 rounded-full flex items-center " +
		"justify-center text-foreground-secondary bg-primary hover:bg-background " +
		"transition-colors duration-300 border-primary border-4";

	const getGallery = entry.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	let gallery = getGallery ?? [];

	gallery = entry.html.attachment?.metadata.html
		? [...gallery, entry.html.attachment?.metadata.html]
		: gallery;

	const isAboutEntry = entry.city && entry.country;

	return (
		<div className={`card-border-wrapper ${className}`} id={toggle_target_id}>
			<div className={styles.card}>
				<div className={styles.info}>
					<div className={styles.date}>
						<span>
							<span className={styles.lightPrimaryText}>
								{format(dtFrom, "yyyy", { locale: en })}
							</span>
						</span>
						<span className={styles.lightPrimaryText}>{" - "}</span>
						{dtTo ? (
							<span>
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
						{entry.city && entry.country && (
							<>
								{(tTime("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
								{(tTime("country_list") as unknown as Record<string, string>)[entry.country]}
							</>
						)}
					</div>
				</div>
				<div className={styles.header}>
					<div className={styles.buttons}>
						<div className={styles.buttonsContainer}>
							<Gallery entry={entry} gallery={gallery} />

							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnMore"), tCommon("btnLess")]}
								type={descriptionArr[1] ? "card" : "card-item-single"}
							/>

							{/*
							 * We need to have property entryType within the AboutEntryData/Project/Post...
							 * Another strategy is to have a switch() based on @/interfaces/_common-data-types.ts/..Tuples
							 */}
							{/* /about?id=entry_65991ea62c5656013d1eae06 */}
							{/* /portfolio?id=project_65db8c233e7b3ef74e682f9b */}
							{/* /portfolio/promptopia-mlt */}
							<a
								aria-label={tCommon("item_link")}
								href={
									isAboutEntry
										? `${Route.public.ABOUT.uri}?id=entry_${entry._id}`
										: entry?.slug
											? `${Route.public.PORTFOLIO.uri}/${entry.slug}`
											: `${Route.public.PORTFOLIO.uri}?id=project_${entry._id}`
								}
							>
								<div className={`${classToggleIcon} group grayscale hover:grayscale-0`}>
									<IconEmbedSvg className="group-hover:hidden" cursor="pointer" type="rocket" />
									<IconEmbedSvg
										className="hidden group-hover:block"
										cursor="pointer"
										type="rocket-launch"
									/>
								</div>
							</a>
						</div>
					</div>
					<div dangerouslySetInnerHTML={{ __html: entry.html.title }} className={styles.title} />
				</div>
				<div className={`${styles.description} md-processed-to-html`}>
					<div className="prose max-w-none">
						{descriptionArr.map((description, index, arr) => (
							<div
								dangerouslySetInnerHTML={{ __html: description }}
								key={index}
								className={
									index === 0
										? arr.length > 1
											? "card-item-static"
											: "card-item-single"
										: "card-item-collapsible"
								}
							/>
						))}
					</div>

					{displayTagsInline && (
						<div className="card-item-collapsible">
							<div className="about-entry-tags">
								{entry.tags
									?.sort((a, b) =>
										a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
									)
									.map((tag) => (
										<DisplayIcon
											key={tag._id}
											description={tag.html.description}
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

export default AboutEntryCard;
