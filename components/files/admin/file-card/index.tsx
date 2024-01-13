import React from "react";

import { FileData } from "@/interfaces/File";

import ToggleCollapsible from "@/components/fragments/toggle-collapsible";
import { msgs } from "@/messages";

import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import DisplaySingleFile from "@/components/fragments/DisplayAttachment";

import styles from "./_file-card.module.scss";
import DisplayFileImage from "./DisplayFileImage";

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
					<div dangerouslySetInnerHTML={{ __html: file.filename }} className={styles.title} />
				</div>

				<div className={`${styles.content} card-item-collapsible`}>
					<div className={styles.description}>
						{descriptionArr.map((description, index) => {
							return <div dangerouslySetInnerHTML={{ __html: description }} key={index} />;
						})}
					</div>

					<div className={styles.imageContainer}>
						{/* If it is another file type, it will be displayed as a link with icon... */}
						<DisplayFileImage className={styles.image} file={file} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileCard;
