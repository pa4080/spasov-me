import { Schema, model, models } from "mongoose";

import { tagTuple } from "@/interfaces/_dataTypes";

import User from "./user";

const TagSchema = new Schema({
	name: {
		type: String,
		required: [true, "Title is required!"],
		match: [/^[a-z-]+$/, "The title must be alphabetic, optionally with dash!"],
	},
	description: {
		type: String,
		required: [true, "Description is required!"],
	},
	tagType: {
		type: String,
		enum: tagTuple,
		default: tagTuple[0],
		required: [true, "Type is required!"],
	},
	icon: {
		type: String,
		required: [true, "Icon is required!"],
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: User,
	},
});

const Tag = models.Tag || model("Tag", TagSchema);
export default Tag;
