import { Schema, model, models } from "mongoose";

import { tagTuple } from "@/interfaces/_common-data-types";

import User from "./user";

const TagSchema = new Schema({
	name: {
		type: String,
		required: [true, "Title is required!"],
		match: [/^[a-z0-9-]+$/, "The title must be alphabetic, optionally with dash!"],
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
	orderKey: {
		type: String,
		default: "1",
		required: [true, "Order key is required!"],
	},
	attachedTo: [
		{
			type: String,
			title: String,
			_id: String,
		},
	],

	creator: {
		type: Schema.Types.ObjectId,
		ref: User,
	},
});

const Tag = models.Tag || model("Tag", TagSchema);
export default Tag;
