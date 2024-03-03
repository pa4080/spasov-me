import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import DisplayFileImage from "@/components/fragments/DisplayFileImage";

import { FileData } from "@/interfaces/File";

import AttachedToBadge from "@/components/fragments/AttachedToBadge";
import RedirectToUri from "@/components/fragments/RedirectToUri";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";
import { capitalize } from "@/lib/capitalize";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { roundTo } from "@/lib/round";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import CopyFileUri from "../file-actions/CopyFileUri";
import DeleteFile from "../file-actions/DeleteFile";
import UpdateFile from "../file-actions/UpdateFile";
import styles from "./_file-card.module.scss";

interface Props {
	className?: string;
	file: FileData;
	section_id?: string;
}

const FileCard: React.FC<Props> = ({ className, file, section_id = "common" }) => {
	const tCommon = msgs("Files");
	const t = msgs("Files_Display");

	const displayActions = true;

	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`file_${file?._id}_${section_id}`);

	const descriptionArr = file.metadata.html.description
		.split(splitDescriptionKeyword)
		.map((str) => {
			return str.replace(commentsMatcher, "");
		});

	return (
		<div
			className={`${styles.cardWrapper} card-borer-wrapper file-card ${className}`}
			id={toggle_target_id}
		>
			<div className={styles.card}>
				<div className={styles.imageContainer}>
					<DisplayFileImage className={`${styles.imageThumb} card-item-thumb`} file={file} />
					<DisplayFileImage className={`${styles.imageLarge} card-item-collapsible`} file={file} />
				</div>
				<div className={styles.header}>
					<div className={`${styles.buttons} ${displayActions ? "w-60" : "w-8"}`}>
						<div className={styles.buttonsContainer}>
							{displayActions && (
								<>
									<CopyFileUri uri={file.metadata.html.fileUri} />
									<VisibilitySwitchDisplay
										disabled
										checked={file.metadata.visibility}
										className="mt-0.5"
									/>
									<DeleteFile file={file} />
									<RedirectToUri uri={file.metadata.html.fileUri} />
									<UpdateFile file={file} />
								</>
							)}
							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnAll"), tCommon("btnLess")]}
								type={"card"}
							/>
						</div>
					</div>
					<div
						dangerouslySetInnerHTML={{ __html: file.metadata.html.title }}
						className={styles.title}
					/>
				</div>
				<div className={styles.info}>
					<div className={styles.size}>
						<span className={styles.lightPrimaryText}>
							{roundTo(Number(file.metadata.size) / 1024, 0).toLocaleString("en-US")}
						</span>
						<span className={styles.lightSecondaryText}>{t("kilobyte")}</span>
					</div>

					<div className={styles.dateModified}>
						<span className={styles.lightPrimaryText}>
							{format(file.metadata.lastModified, "MMM. d, yyyy", { locale: en })}
						</span>
					</div>

					<div className={styles.contentType}>
						<span className={styles.lightPrimaryText}>{file.metadata.contentType}</span>
					</div>
				</div>

				<div className={`${styles.contentWrapper} card-item-collapsible`}>
					<div className={styles.content}>
						<div className={`${styles.description} md-processed-to-html`}>
							{descriptionArr.map((description, index) => {
								return <div dangerouslySetInnerHTML={{ __html: description }} key={index} />;
							})}
						</div>
						{file.metadata.attachedTo && file.metadata.attachedTo.length > 0 && (
							<div className={`${styles.attachedTo}`}>
								{file.metadata.attachedTo.map((item, index) => (
									<AttachedToBadge
										key={index}
										badgeLabel={item.title}
										ttContentLn1={`${capitalize(item.modelType)}: ${item.title}`}
										ttContentLn2={t("index_id", { index, id: item._id })}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileCard;
