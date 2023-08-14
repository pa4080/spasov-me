"use client";

import React, { useState } from "react";
import Link from "next/link";

import { NewPageObject, EditDataOfPageObject, PageObject } from "@/interfaces/Page";
import { cn } from "@/lib/utils";

import { useAppContext } from "@/contexts/AppContext";

import IconEmbedSvg from "../fragments/IconEmbedSvg";
import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import Pages_Dialog_Add from "./Pages_Dialog_Add";
import Pages_Dialog_Delete from "./Pages_Dialog_Delete";

interface Props {
	className?: string;
	pages: PageObject[];
}

const Pages_Feed: React.FC<Props> = ({ className, pages }) => {
	const { session } = useAppContext();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
	const [actionPage, setActionPage] = useState<EditDataOfPageObject>({} as EditDataOfPageObject);
	const [actionPageId, setActionPageId] = useState("");

	const handleRemove = (e: React.SyntheticEvent, page: PageObject) => {
		e.preventDefault();
		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			image: page.image?.filename,
		});
		setIsRemoveDialogOpen(true);
		setActionPageId(page._id);
	};

	const handleEdit = (e: React.SyntheticEvent, page: PageObject) => {
		e.preventDefault();
		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			image: page.image?.filename,
		});
		setIsEditDialogOpen(true);
		setActionPageId(page._id);
	};

	return (
		<div className={cn("", className)}>
			<div className="pages_feed">
				{pages?.map((page, index) => (
					<Link key={index} href={`/${page.uri}`}>
						<div key={index} className="pages_card">
							{session?.user && (
								<div className="pages_card_actions">
									<div
										className="pages_card_action_button pl-[2.5px]"
										onClick={(e) => handleRemove(e, page)}
									>
										<IconEmbedSvg
											c1={"mlt-purple-dark"}
											c2={"mlt-purple-dark"}
											type="trash"
											width={18}
										/>
									</div>
									<div
										className="pages_card_action_button pl-[4px]"
										onClick={(e) => handleEdit(e, page)}
									>
										<IconEmbedSvg
											c1={"mlt-purple-dark"}
											c2={"mlt-purple-dark"}
											type="brush"
											width={18}
										/>
									</div>
								</div>
							)}
							<h1 className="pages_card_title">{page.title}</h1>
							<span>{page.description}</span>
						</div>
					</Link>
				))}
			</div>

			<Pages_Dialog_Add />
			<Pages_Dialog_Edit
				isOpen={isEditDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				setIsOpen={setIsEditDialogOpen}
			/>
			<Pages_Dialog_Delete
				isOpen={isRemoveDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				setIsOpen={setIsRemoveDialogOpen}
			/>
		</div>
	);
};

export default Pages_Feed;
