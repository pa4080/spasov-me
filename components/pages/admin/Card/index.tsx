import React from "react";

import Image from "next/image";

import FileAddressHandle from "@/components/fragments/FileAddressHandle";
import { FileListItem } from "@/interfaces/File";
import { PageCardData } from "@/interfaces/PageCard";
import { msgs } from "@/messages";

import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";

import styles from "../../_pages.module.scss";
import DeletePage from "../Actions/DeletePage";
import UpdatePage from "../Actions/UpdatePage";

interface Props {
	className?: string;
	page: PageCardData;
	files: FileListItem[] | null | undefined;
}

const PageCard: React.FC<Props> = ({ className, page, files }) => {
	const t = msgs("PageCards");

	return (
		<div className={`${styles.card} ${className}`}>
			<div className={styles.buttons}>
				<DeletePage page_id={page._id} page_title={page.title} />
				<FileAddressHandle address={`/${page.uri}`} />
				<VisibilitySwitchDisplay disabled checked={page.visibility} className="mt-1 mr-1" />
				<UpdatePage files={files} page={page} />
			</div>
			{page.attachment && page.html.attachment && (
				<div className={styles.cardImageEditMode}>
					<Image
						priority
						alt={t("index_pageAttachment_alt", { title: page.title })}
						height={260}
						src={page.html.attachment?.metadata.html.fileUri}
						unoptimized={page.html.attachment.filename.match(/\.svg$/) ? true : false}
						width={462}
					/>
				</div>
			)}
			<h1 className={`${styles.title} mt-4`}>{page.title}</h1>
			<span>{page.description}</span>
		</div>
	);
};

export default PageCard;
