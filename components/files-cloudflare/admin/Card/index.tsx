import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import DisplayFileImage from "@/components/fragments/DisplayFileImage";

import { FileData } from "@/interfaces/File";

import AttachedToBadge from "@/components/fragments/AttachedToBadge";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";
import { capitalize } from "@/lib/capitalize";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import FileAddressHandle from "@/components/fragments/FileAddressHandle";

import { roundTo } from "@/lib/round";

import Gallery from "@/components/fragments/Gallery";

import CopyFileAddressToClipboard from "../../../fragments/CopyFileAddressToClipboard";
import DeleteFile from "../Actions/DeleteFile";
import UpdateFile from "../Actions/UpdateFile";
import styles from "./_file-card.module.scss";

interface Props {
	className?: string;
	file: FileData;
	section_id?: string;
	files_prefix: string;
}

const FileCard: React.FC<Props> = ({ className, file, section_id = "common", files_prefix }) => {
	const tCommon = msgs("Files");
	const t = msgs("Files_Display");

	const toggle_target_id = sanitizeHtmlTagIdOrClassName(
		`file_${file?._id}_${section_id}`.replace(/[^0-9a-zA-Z]/g, "-")
	);

	const descriptionArr = file.metadata.html.description
		.split(splitDescriptionKeyword)
		.map((str) => {
			return str.replace(commentsMatcher, "");
		});

	const fileAddress = file.metadata.html.fileUri || file.metadata.html.fileUrl || "";

	return (
		<div
			className={`${styles.cardWrapper} card-border-wrapper file-card ${className}`}
			id={toggle_target_id}
		>
			<div className={styles.card}>
				<div className={styles.imageContainer}>
					<DisplayFileImage className={`${styles.imageThumb} card-item-thumb`} file={file} />
					<DisplayFileImage className={`${styles.imageLarge} card-item-collapsible`} file={file} />
				</div>
				<div className={styles.header}>
					<div className={styles.buttons}>
						<div className={styles.buttonsContainer}>
							<Gallery
								entry={{ title: file.filename }}
								gallery={[file.metadata.html]}
								height={24}
								width={24}
							/>
							<FileAddressHandle download address={fileAddress} />
							<CopyFileAddressToClipboard address={fileAddress} className="mt-0.5" />
							<FileAddressHandle address={fileAddress} />
							<DeleteFile file={file} files_prefix={files_prefix} />
							<VisibilitySwitchDisplay disabled checked={file.metadata.visibility} />
							<UpdateFile file={file} files_prefix={files_prefix} />

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
