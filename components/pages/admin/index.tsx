"use client";

import React, { useState } from "react";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { useAppContext } from "@/contexts/AppContext";

import { PageDoc } from "@/interfaces/Page";
import { cn } from "@/lib/cn-utils";

import PageCreate from "./PageCreate";
import PageDelete from "./PageDelete";
import PageUpdate from "./PageUpdate";
import { Pages_FormSchema } from "./page-form/schema";

import styles from "../_pages.module.scss";
import PageDisplay from "./PageDisplay";

export interface GenericActionProps {
	className?: string;
	session: Session | null;
	setPages: React.Dispatch<React.SetStateAction<PageDoc[]>>;
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

	const handleDelete = (e: React.SyntheticEvent, page: PageDoc) => {
		e.preventDefault();

		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			image: page.image?._id.toString(),
			visibility:
				typeof page.visibility === "string"
					? page.visibility === "true"
						? true
						: false
					: page.visibility,
		});

		setActionPageId(page._id);

		setIsDeleteDialogOpen(true);
	};

	const handleEdit = (e: React.SyntheticEvent, page: PageDoc) => {
		e.preventDefault();

		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			image: page.image?._id.toString(),
			visibility:
				typeof page.visibility === "string"
					? page.visibility === "true"
						? true
						: false
					: page.visibility,
		});

		setActionPageId(page._id);

		setIsEditDialogOpen(true);
	};

	return (
		<div className={cn(styles.pages, className)}>
			<PageCreate session={session} setPages={setPages} />

			<div className={cn(styles.feed, "mt-16")}>
				{pages?.map((page, index) => (
					<PageDisplay
						key={index}
						handleDelete={handleDelete}
						handleEdit={handleEdit}
						page={page}
					/>
				))}
			</div>

			<PageUpdate
				isOpen={isEditDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				session={session}
				setIsOpen={setIsEditDialogOpen}
				setPages={setPages}
			/>

			<PageDelete
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
