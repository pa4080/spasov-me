import React from "react";

import Image from "next/image";

import { Switch } from "@/components/ui/switch";
import { PageData } from "@/interfaces/Page";
import { msgs } from "@/messages";

import RedirectToUri from "@/components/fragments/RedirectToUri";

import { FileListItem } from "@/interfaces/File";

import styles from "../../_pages.module.scss";
import DeletePage from "../page-actions/DeletePage";
import UpdatePage from "../page-actions/UpdatePage";

interface Props {
	className?: string;
	page: PageData;
	files: FileListItem[] | null | undefined;
}

const PageCard: React.FC<Props> = ({ className, page, files }) => {
	const t = msgs("PageCards");

	return (
		<div className={`${styles.card} ${className}`}>
			<div className={styles.buttons}>
				<DeletePage page_id={page._id} page_title={page.title} />
				<RedirectToUri uri={`/${page.uri}`} />
				<Switch
					disabled
					checked={
						typeof page.visibility === "string"
							? page.visibility === "true"
								? true
								: false
							: page.visibility
					}
					className="mt-1 mr-1"
				/>
				<UpdatePage files={files} page={page} />
			</div>
			{page.attachment && page.html.attachmentUri && (
				<div className={styles.cardImageEditMode}>
					<Image
						priority
						alt={t("index_pageAttachment_alt", { title: page.title })}
						height={260}
						src={page.html.attachmentUri}
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
