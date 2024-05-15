import React from "react";

import Link from "next/link";

import DisplayIcon from "@/components/fragments/DisplayIcon";

import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import { getPageCards } from "../_pages.actions";
import styles from "../_pages.module.scss";

interface Props {
	className?: string;
}

const PagesPublic: React.FC<Props> = async ({ className }) => {
	const pages = await getPageCards({ public: true });

	return (
		<div className={`${styles.pages} ${className}`}>
			<div className={styles.feed}>
				{pages?.map((page, index) => (
					<Link key={index} href={`/${page.uri}`}>
						<div key={index} className={styles.card}>
							<div className="flex items-center justify-between w-full">
								<h1 className={styles.title}>{page.title}</h1>

								<div
									className="rounded-full p-1 overflow-clip bg-primary/80 min-w-[56px] w-[56px]"
									style={{
										filter: page?.icon ? "" : "grayscale(1)",
									}}
								>
									<DisplayIcon
										className="hover:bg-transparent dark:hover:bg-transparent"
										icon={iconsMap[(page?.icon as IconsMapItem) || "ss_spasov.me.logo"]}
										size={48}
									/>
								</div>
							</div>
							<p>{page.description}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default PagesPublic;
