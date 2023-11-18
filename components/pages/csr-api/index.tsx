"use client";

import React, { useState } from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";

import { useAppContext } from "@/contexts/AppContext";

import { PageObject } from "@/interfaces/Page";
import { cn } from "@/lib/cn-utils";
import ButtonIcon from "@/components/fragments/ButtonIcon";

import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import Pages_Dialog_Add from "./Pages_Dialog_Add";
import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import { Pages_FormSchema } from "./Pages_Form";

import styles from "../_pages.module.scss";

export interface PagesActions {
	className?: string;
	session: Session | null;
	setPages: React.Dispatch<React.SetStateAction<PageObject[]>>;
}

interface Props {
	className?: string;
}

const PagesFeedAndEditOptions: React.FC<Props> = ({ className }) => {
	const { pages, setPages } = useAppContext();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionPageId, setActionPageId] = useState("");
	const [actionPage, setActionPage] = useState<Pages_FormSchema>();

	const { data: session } = useSession();

	const handleDelete = (e: React.SyntheticEvent, page: PageObject) => {
		e.preventDefault();

		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			imageFile: page.image?.filename,
		});
		setActionPageId(page._id);

		setIsDeleteDialogOpen(true);
	};

	const handleEdit = (e: React.SyntheticEvent, page: PageObject) => {
		e.preventDefault();

		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			imageFile: page.image?.filename,
		});
		setActionPageId(page._id);

		setIsEditDialogOpen(true);
	};

	return (
		<div className={cn(styles.homePage, className)}>
			<Pages_Dialog_Add session={session} setPages={setPages} />

			<div className={cn(styles.pagesFeed, className)}>
				{pages?.map((page, index) => (
					<Link key={index} href={`/${page.uri}`}>
						<div key={index} className={styles.pagesCard}>
							{session?.user && (
								<div className={styles.pagesCardActions}>
									<ButtonIcon
										className="pl-[2.6px] bg-transparent icon_accent_secondary"
										height={18}
										type="trash"
										width={18}
										onClick={(e) => handleDelete(e, page)}
									/>
									<ButtonIcon
										className="pl-[5px] bg-transparent icon_accent_secondary"
										height={18}
										type="brush"
										width={18}
										onClick={(e) => handleEdit(e, page)}
									/>
								</div>
							)}
							<h1 className={styles.title}>{page.title}</h1>
							<span>{page.description}</span>
						</div>
					</Link>
				))}
			</div>

			<Pages_Dialog_Edit
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
			/>
		</div>
	);
};

export default PagesFeedAndEditOptions;
