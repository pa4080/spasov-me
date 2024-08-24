"use client";

import { LabEntryData } from "@/interfaces/LabEntry";

import DisplayWebLink from "./DisplayWebLink";

interface Props {
	labEntry: LabEntryData;
}

const PostLinks: React.FC<Props> = ({ labEntry }) => {
	// const t = msgs("Posts_CardPublic");

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full";

	return labEntry.urlHome ? (
		<div className="pt-0 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className={iconWrapper}>
				<DisplayWebLink
					className="grayscale-[100%] hover:grayscale-[20%] opacity-90"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					labEntry={labEntry}
					size={23}
					type="Home Page"
				/>
			</div>
		</div>
	) : (
		<div />
	);
};

export default PostLinks;
