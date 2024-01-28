import { FileDocument } from "./File";
import { UserObject } from "./User";

export type PageDoc = {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	uri: string;
	attachment?: FileDocument;
	visibility: boolean | string;
};

export type NewPageDoc = Omit<PageDoc, "_id" | "attachment" | "creator"> & {
	creator: string;
	attachment?: string;
};

type PageDocToFetch = {
	data: PageDoc | NewPageDoc | Record<string, unknown>;
	// attachment_id?: string | null;
	user_id?: string | undefined;
};

export const preparePageDocToFetch = ({ data, user_id }: PageDocToFetch) => {
	return JSON.stringify({
		...data,
		creator: user_id,
	});
};
