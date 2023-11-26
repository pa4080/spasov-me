import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

export type FileDocument = Omit<GridFSFile, "metadata"> & {
	metadata: {
		description: string;
		creator: UserObject;
		size: string;
		contentType: string;
		lastModified: Date;
		originalName: string;
		uri?: string;
	};
};
