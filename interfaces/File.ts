import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

export type FileObject = Omit<GridFSFile, "metadata"> & {
	metadata: {
		description: string;
		creator: UserObject;
		size: string;
		contentType: string;
		lastModified: string;
		originalName: string;
	};
};
