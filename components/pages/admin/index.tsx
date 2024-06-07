import React from "react";

import { getPageCards } from "../_pages.actions";
import styles from "../_pages.module.scss";
import Section from "./Section";

interface Props {
	className?: string;
}

const PagesAdmin: React.FC<Props> = async ({ className }) => {
	const pages = await getPageCards({ public: false });

	return (
		<div className={`${styles.pages} ${className}`}>
			<Section pages={pages} type="common" />
		</div>
	);
};

export default PagesAdmin;
