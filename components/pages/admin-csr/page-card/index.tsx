"use client";

import React from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { Switch } from "@/components/ui/switch";
import { PageDoc } from "@/interfaces/Page";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import styles from "../_pages.module.scss";

interface Props {
	className?: string;
	page: PageDoc;
	handleDelete: (e: React.SyntheticEvent, page: PageDoc) => void;
	handleEdit: (e: React.SyntheticEvent, page: PageDoc) => void;
}

const PageCard: React.FC<Props> = ({ className, page, handleDelete, handleEdit }) => {
	const t = msgs("PagesFeed");
	const router = useRouter(); // We can't use <Link><ButtonIcon /></Link>, because Tge inner component have onClick()

	return (
		<div className={`${styles.card} ${className}`}>
			<div className={styles.buttons}>
				<ButtonIcon
					className="pl-[2.6px] bg-transparent icon_accent_secondary"
					height={18}
					type="trash"
					width={18}
					onClick={(e) => handleDelete(e, page)}
				/>
				<ButtonIcon
					className="pl-[2.8px] bg-transparent icon_accent_secondary"
					height={18}
					type="up-right-from-square"
					width={18}
					onClick={() => {
						router.push(`/${page.uri}`);
					}}
				/>
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
				<ButtonIcon
					className="pl-[4.5px] bg-transparent icon_accent_secondary"
					height={18}
					type="brush"
					width={18}
					onClick={(e) => handleEdit(e, page)}
				/>
			</div>
			{page.attachment && (
				<div className={styles.cardImageEditMode}>
					<Image
						priority
						alt={t("index_pageAttachment_alt", { title: page.title })}
						height={260}
						src={`${Route.api.FILES}/${page.attachment._id.toString()}/${page.attachment.filename}`}
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
