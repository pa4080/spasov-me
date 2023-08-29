/**
 * For internationalization, for example,
 * you can use the following package:
 * @see https://github.com/alexsk/mongoose-intl
 */
import { Schema, model, models } from "mongoose";

import { GridFS } from "./grid_fs";
import User from "./user";

const PageSchema = new Schema({
	creator: {
		type: Schema.Types.ObjectId,
		ref: User,
	},
	title: {
		type: String,
		required: [true, "Title is required!"],
	},
	description: {
		type: String,
		required: [true, "Description is required!"],
	},
	uri: {
		type: String,
		match: [/^[a-z][a-z0-9-]+$/, "The URI must start wit lowercase latin alphabet!"],
	},
	image: {
		type: Schema.Types.ObjectId,
		ref: GridFS,
	},
});

const Page = models.Page || model("Page", PageSchema);
export default Page;
