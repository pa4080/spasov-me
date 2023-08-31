import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

export type FileObject = Omit<GridFSFile, "metadata"> & {
	metadata: {
		description: string;
		creator: UserObject;
	};
};

export type EditDataOfFileObject = Omit<
	FileObject,
	"_id" | "chunkSize" | "aliases" | "length" | "metadata"
> & {
	description: string;
};
