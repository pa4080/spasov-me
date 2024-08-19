"use client";

import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";

import DisplayResourceUrlAsIcon from "./DisplayResourceUrlAsIcon";

interface Props {
	labEntry_urlHome: string | undefined;
	fileList?: FileListItem[] | null;
	iconList?: FileListItem[] | null;
	iconsMap?: IconsMap;
	tags?: TagData[] | null;
}

const PostLinks: React.FC<Props> = ({ labEntry_urlHome }) => {
	// const t = msgs("Posts_CardPublic");

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full";

	return labEntry_urlHome ? (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className="flex gap-0 items-center justify-start">
				<div className={iconWrapper}>
					<DisplayResourceUrlAsIcon
						height={18}
						icon_className_Path2="fill-accent"
						type="Home Page"
						url={labEntry_urlHome}
						width={26}
					/>
				</div>
			</div>
		</div>
	) : (
		<div />
	);
};

export default PostLinks;
