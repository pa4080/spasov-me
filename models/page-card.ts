/**
 * For internationalization, for example,
 * you can use the following package:
 * @see https://github.com/alexsk/mongoose-intl
 */
import { Schema, model, models } from "mongoose";

import User from "./user";

const PageCardSchema = new Schema({
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
		type: String,
		// type: Schema.Types.ObjectId,
		// ref: FileGFS,
	},
	icon: {
		type: String,
	},
});

const PageCard = models.PageCard || model("PageCard", PageCardSchema);
export default PageCard;
