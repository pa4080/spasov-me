"use client";

import React, { useState } from "react";

import { useSession } from "next-auth/react";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/section-header";
import { useAppContext } from "@/contexts/AppContext";
import { PageDoc } from "@/interfaces/Page";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import CreatePage from "./page-actions/CreatePage";
import DeletePage from "./page-actions/DeletePage";
import UpdatePage from "./page-actions/UpdatePage";
import { Pages_FormSchema } from "./page-form/schema";

import styles from "../_pages.module.scss";
import PageCard from "./page-card";

interface Props {
	className?: string;
}

const PagesAdmin: React.FC<Props> = ({ className }) => {
	const { pages, setPages } = useAppContext();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionPageId, setActionPageId] = useState("");
	const [actionPage, setActionPage] = useState<Pages_FormSchema>();

	const { data: session } = useSession();

	const t = msgs("PagesFeed");

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

	const Section = ({ pages, title: section_title }: { pages: PageDoc[]; title: string }) => (
		<div className={styles.section}>
			<SectionHeader title={section_title}>
				<RevalidatePaths paths={[Route.public.HOME.uri]} />
				<CreatePage session={session} setPages={setPages} />
			</SectionHeader>

			<div className={`${styles.feed} mt-16`}>
				{pages?.map((page, index) => (
					<PageCard key={index} handleDelete={handleDelete} handleEdit={handleEdit} page={page} />
				))}
			</div>
		</div>
	);

	return (
		<div className={`${styles.pages} ${className}`}>
			<Section pages={pages} title={t("index_title")} />

			<UpdatePage
				isOpen={isEditDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				session={session}
				setIsOpen={setIsEditDialogOpen}
				setPages={setPages}
			/>

			<DeletePage
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

export default PagesAdmin;
