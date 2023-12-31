import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

export interface FileDocument extends Omit<GridFSFile, "metadata"> {
	metadata: {
		description: string;
		creator: UserObject;
		size: string;
		contentType: string;
		lastModified: Date;
		originalName: string;
		uri?: string;
	};
}

export interface FileListItem {
	value: string;
	label: string;
}
