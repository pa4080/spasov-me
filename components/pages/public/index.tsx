import React from "react";

import Link from "next/link";

import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import DisplayIconLight from "@/components/fragments/DisplayIconLight";

import { getPageCards } from "../_pages.actions";

interface Props {
	className?: string;
}

const PagesPublic: React.FC<Props> = async ({ className }) => {
	const pages = await getPageCards({ public: true });

	return (
		<div className={className}>
			<div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{pages?.map((page, index) => (
					<Link key={index} href={`/${page.uri}`}>
						<div
							key={index}
							className="bg-card/50 md:bg-card/[25%] dark:bg-card/25 rounded-2xl h-full p-6 pt-5 relative min-h-fit flex items-start flex-col gap-4 justify-start border-4 border-transparent hover:bg-popover/80 dark:hover:bg-popover hover:shadow-home-cards dark:hover:border-primary/60 transition-all duration-500"
						>
							<div className="flex items-center justify-between w-full">
								<h1 className="font-unicephalon text-2xl tracking-wider text-foreground-secondary">
									{page.title}
								</h1>

								<div
									className="rounded-full p-1 overflow-clip bg-primary/80 min-w-[56px] w-[56px]"
									style={{
										filter: page?.icon ? "" : "grayscale(1)",
									}}
								>
									<DisplayIconLight
										height={48}
										icon={iconsMap[page?.icon as IconsMapItem]}
										width={48}
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
