"use client";

import React from "react";
import { Session } from "next-auth";

import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { AboutEntryDoc } from "@/interfaces/AboutEntry";

import EntryForm from "./entry-form";
import styles from "../_about.module.scss";
import { Entry_FormSchema } from "./entry-form/schema";

export interface ActionsPropsGeneric {
	className?: string;
	session: Session | null;
	setEntryList: () => void;
}

interface Props {
	className?: string;
}

const PagesFeedAndEditOptions: React.FC<Props> = ({ className }) => {
	const t = msgs("AboutCV");

	const handleAddPage = (data: Entry_FormSchema) => {
		// toast({
		// 	title: t("dialog_toast_submit_title"),
		// 	description: <pre className="toast_pre_info">{JSON.stringify(data, null, 2)}</pre>,
		// }) && setIsOpen(false);

		// eslint-disable-next-line no-console
		console.log(data);
	};

	return (
		<div className={cn(styles.about, className)}>
			<EntryForm submitting={false} onSubmit={handleAddPage} />
			{/* <Pages_Dialog_Add session={session} setPages={setPages} /> */}

			{/* <div className={cn(styles.feed, "mt-16")}>
				{pages?.map((page, index) => (
					// <Link key={index} href={`/${page.uri}`}>
					<div key={index} className={styles.card}>
						<div className={styles.cardEditActions}>
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
						{page.image && (
							<div className={styles.cardImageEditMode}>
								<Image
									priority
									alt={t("index_pageImage_alt", { title: page.title })}
									height={260}
									src={`${Route.api.FILES}/${page.image._id.toString()}/${page.image.filename}`}
									width={462}
								/>
							</div>
						)}
						<h1 className={cn(styles.title, "mt-4")}>{page.title}</h1>
						<span>{page.description}</span>
					</div>
					// </Link>
				))}
			</div> */}
			{/* <Pages_Dialog_Edit
				isOpen={isEditDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				session={session}
				setIsOpen={setIsEditDialogOpen}
				setPages={setPages}
			/>
			<Pages_Dialog_Delete
				isOpen={isDeleteDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				session={session}
				setIsOpen={setIsDeleteDialogOpen}
				setPages={setPages}
			/> */}
		</div>
	);
};

export default PagesFeedAndEditOptions;
