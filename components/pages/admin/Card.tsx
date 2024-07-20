import React from "react";

import Image from "next/image";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import FileAddressHandle from "@/components/fragments/FileAddressHandle";
import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { PageCardData } from "@/interfaces/PageCard";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import styles from "../_pages.module.scss";
import DeletePage from "./Actions/DeletePage";
import UpdatePage from "./Actions/UpdatePage";

interface Props {
	className?: string;
	page: PageCardData;
	iconsMap: IconsMap;
	fileList: FileListItem[] | null;
}

const PageCard: React.FC<Props> = ({ className, page, iconsMap, fileList }) => {
	const t = msgs("PageCards");

	return (
		<div className={`${styles.card} ${className}`}>
			<div className={styles.buttons}>
				<div
					className="rounded-full p-1 overflow-clip bg-primary/80 min-w-[3rem]"
					style={{
						filter: page?.icon ? "" : "grayscale(1)",
					}}
				>
					<DisplayIcon
						className="hover:bg-transparent dark:hover:bg-transparent"
						icon={iconsMap[page?.icon || "ss_spasov.me.logo"]}
						size={40}
					/>
				</div>

				<div className="flex gap-1">
					<DeletePage page_id={page._id} page_title={page.title} />
					<FileAddressHandle address={`/${page.uri}`} />
					<VisibilitySwitchDisplay disabled checked={page.visibility} className="mt-1 mr-1" />
					<UpdatePage fileList={fileList} icons={iconsMap} page={page} />
				</div>
			</div>
			{page.attachment && page.html.attachment && (
				<div className={styles.cardImageEditMode}>
					<Image
						priority
						alt={t("index_pageAttachment_alt", { title: page.title })}
						height={260}
						src={
							page.html.attachment?.metadata?.html?.fileUri ||
							page.html.attachment?.metadata?.html?.fileUrl ||
							Route.assets.IMAGE_PLACEHOLDER
						}
						unoptimized={page.html.attachment.filename.match(/\.svg$/) ? true : false}
						width={462}
					/>
				</div>
			)}
			<h1 className={`${styles.title} mt-12`}>{page.title}</h1>
			<span>{page.description}</span>
		</div>
	);
};

export default PageCard;
