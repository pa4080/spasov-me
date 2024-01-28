/**
 * For internationalization, for example,
 * you can use the following package:
 * @see https://github.com/alexsk/mongoose-intl
 */
import { Schema, model, models } from "mongoose";

import FileGFS from "./file";
import User from "./user";

const PageSchema = new Schema({
	title: {
		type: String,
		required: [true, "Title is required!"],
	},
	description: {
		type: String,
		required: [true, "Description is required!"],
	},
	visibility: {
		type: Boolean,
		required: [true, "Visibility is required!"],
	},
	uri: {
		type: String,
		match: [/^[a-z][a-z0-9-]+$/, "The URI must start wit lowercase latin alphabet or number!"],
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: User,
	},
	attachment: {
		type: Schema.Types.ObjectId,
		ref: FileGFS,
	},
});

const Page = models.Page || model("Page", PageSchema);
export default Page;
