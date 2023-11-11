import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

export type PageObject = {
	_id: string;
	creator: UserObject;
	title: string;
	description: string;
	uri: string;
	image?: GridFSFile;
};

export type NewPageObject = Omit<PageObject, "_id" | "image">;

export type ErrorPageObject = {
	[key in keyof PageObject]: {
		kind?: string; // "regexp", "required", etc.
		message?: string; // the actual error message
		name?: string; // ValidatorError
		path?: string; // image, link, etc.
		properties?: {}; // contains the same information as the other fields
		value?: string; // the actual value that caused the error
	};
};

type PageObjectToFetch = {
	data: PageObject | NewPageObject | Record<string, unknown>;
	image_id?: string | null;
	user_id?: string | undefined;
};

export const preparePageObjectToFetch = ({ data, image_id, user_id }: PageObjectToFetch) => {
	return JSON.stringify({
		...data,
		image: image_id,
		creator: user_id,
	});
};
