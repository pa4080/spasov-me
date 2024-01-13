import React from "react";

import { FileData } from "@/interfaces/File";

import ToggleCollapsible from "@/components/fragments/toggle-collapsible";
import { msgs } from "@/messages";

import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import DisplaySingleFile from "@/components/fragments/DisplayAttachment";

import DisplayFileImage from "../../../fragments/DisplayFileImage";
import styles from "./_file-card.module.scss";

interface Props {
	className?: string;
	file: FileData;
}

const FileCard: React.FC<Props> = ({ className, file }) => {
	const tCommon = msgs("FilesAdmin");

	const displayActions = true;

	const toggle_target_id = `file_${file?._id.toString()}`;

	const descriptionArr = file.metadata.html.description
		.split(splitDescriptionKeyword)
		.map((str) => {
			return str.replace(commentsMatcher, "");
		});

	return (
		<div className={`${styles.cardWrapper} ${className}`} id={toggle_target_id}>
			<div className={styles.card}>
				<div className={styles.imageContainer}>
					<DisplayFileImage className={`${styles.imageThumb} card-item-collapsed`} file={file} />
					<DisplayFileImage className={`${styles.imageLarge} card-item-collapsible`} file={file} />
				</div>
				<div className={styles.header}>
					<div className={`${styles.buttons} ${displayActions ? "w-36" : "w-8"}`}>
						<div className={styles.buttonsContainer}>
							{displayActions && (
								<>
									<DisplaySingleFile uri={file.metadata.html.fileUri} />
									{/* <EntryDelete entry_id={entry._id} type={entry.entryType} />
									<DisplayAttachment uri={entry.html.attachmentUri} />
									<EntryUpdate entry={entry} files={files} tags={tags} type={entry.entryType} /> */}
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

				<div className={`${styles.content} card-item-collapsible`}>
					<div className={`${styles.description} md-processed-to-html`}>
						{descriptionArr.map((description, index) => {
							return <div dangerouslySetInnerHTML={{ __html: description }} key={index} />;
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileCard;
