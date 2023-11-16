import React, { useEffect, useState } from "react";
import Link from "next/link";

import { useAppContext } from "@/contexts/AppContext";
import { PageObject } from "@/interfaces/Page";
import { cn } from "@/lib/cn-utils";
import ButtonIcon from "@/components/fragments/ButtonIcon";

import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import Pages_Dialog_Add from "./Pages_Dialog_Add";
import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import { Pages_FormSchema } from "./Pages_Form";

import styles from "../_home-page.module.scss";
import { addPage, getPages } from "../_home-page.functions";
import PagesFeed from "./Feed";

interface Props {
	className?: string;
}

const Pages_Feed: React.FC<Props> = async ({ className }) => {
	const pages = await getPages();

	return <PagesFeed addPage={addPage} className={className} pages={pages} />;
};

export default Pages_Feed;
