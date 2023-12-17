import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

export type PageDoc = {
	_id: string;
	creator: UserObject;
	title: string;
	description: string;
	uri: string;
	image?: GridFSFile;
	visibility: boolean | string;
};

export type NewPageDoc = Omit<PageDoc, "_id" | "image" | "creator"> & {
	creator: string;
	image?: string;
};

type PageDocToFetch = {
	data: PageDoc | NewPageDoc | Record<string, unknown>;
	// image_id?: string | null;
	user_id?: string | undefined;
};

export const preparePageDocToFetch = ({ data, user_id }: PageDocToFetch) => {
	return JSON.stringify({
		...data,
		creator: user_id,
	});
};
