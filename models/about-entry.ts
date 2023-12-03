import { Schema, model, models } from "mongoose";

import { AboutEntryTuple } from "@/interfaces/AboutEntry";

import GridFS from "./grid_fs";
import User from "./user";

const AboutEntrySchema = new Schema({
	title: {
		type: String,
		required: [true, "Title is required!"],
	},
	description: {
		type: String,
		required: [true, "Description is required!"],
	},
	country: {
		type: String,
		required: [true, "The county is required!"],
	},
	city: {
		type: String,
		required: [true, "The city is required!"],
	},
	dateFrom: {
		type: Date,
		required: [true, "Date 'from' is required!"],
	},
	dateTo: {
		type: Date,
		required: [true, "Date 'to' is required!"],
	},
	type: {
		type: String,
		enum: AboutEntryTuple, // ["employment", "education"],
		default: AboutEntryTuple[0], // "employment",
		required: [true, "Type is required!"],
	},
	visibility: {
		type: Boolean,
		required: [true, "Visibility is required!"],
	},

	creator: {
		type: Schema.Types.ObjectId,
		ref: User,
	},
	image: {
		type: Schema.Types.ObjectId,
		ref: GridFS,
	},
});

const AboutEntry = models.AboutEntry || model("AboutEntry", AboutEntrySchema);
export default AboutEntry;
