import Link from "next/link";
import React from "react";

import styles from "@/app/(styles)/card.module.scss";
import DisplayIconLight from "@/components/fragments/DisplayIconLight";
import { IconsMap } from "@/interfaces/IconsMap";
import { PageCardData } from "@/interfaces/PageCard";

interface Props {
	className?: string;
	page: PageCardData;
	iconsMap: IconsMap;
}

const PagesPublic_Card: React.FC<Props> = async ({ className, page, iconsMap }) => {
	return (
		<Link href={`/${page.uri}`}>
			<div className={`${styles.card} ${className}`}>
				<div className="flex items-center justify-between w-full">
					<h1 className="font-unicephalon text-2xl tracking-wider text-foreground-secondary">
						{page.title}
					</h1>

					<div
						className="rounded-full p-[6px] overflow-clip bg-primary/80 min-w-[60px] w-[60px] h-[60px]"
						style={{
							filter: page?.icon ? "" : "grayscale(1)",
						}}
					>
						<DisplayIconLight height={48} icon={iconsMap[page?.icon]} width={48} />
					</div>
				</div>
				<p>{page.description}</p>
			</div>
		</Link>
	);
};

export default PagesPublic_Card;
