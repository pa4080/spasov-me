import { Schema, model, models } from "mongoose";

import { GridFS } from "./grid_fs";

const PageSchema = new Schema({
	title: {
		type: String,
		required: [true, "Title is required!"],
	},
	description: {
		type: Array,
		required: [true, "Description is required!"],
	},
	uri: {
		type: String,
		match: [/^[a-z]*/, "The URI must start wit lowercase lati alphabet!"],
	},
	image: {
		type: Schema.Types.ObjectId,
		ref: GridFS,
	},
});

const Page = models.Page || model("Post", PageSchema);
export default Page;
