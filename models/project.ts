import { Schema, model, models } from "mongoose";

import { projectTuple } from "@/interfaces/_common-data-types";

import FileGFS from "./file";
import Tag from "./tag";
import User from "./user";

const ProjectSchema = new Schema({
	title: {
		type: String,
		required: [true, "Title is required!"],
	},
	description: {
		type: String,
		required: [true, "Description is required!"],
	},
	projectType: {
		type: String,
		enum: projectTuple,
		default: projectTuple[0],
		required: [true, "Type is required!"],
	},
	urlHome: {
		type: String,
		required: [false, "The project's home url is not required!"],
	},
	urlRepo: {
		type: String,
		required: [false, "The project's repository url is not required!"],
	},
	dateFrom: {
		type: Date,
		required: [true, "Date 'from' is required!"],
	},
	dateTo: {
		type: Date,
		// it is not required, so when it is not defined the frontend will display "Now"
	},
	visibility: {
		type: Boolean,
		required: [true, "Visibility is required!"],
	},
	attachment: {
		type: Schema.Types.ObjectId,
		ref: FileGFS,
	},
	icon: {
		type: Schema.Types.ObjectId,
		ref: FileGFS,
	},
	gallery: [
		{
			type: Schema.Types.ObjectId,
			ref: FileGFS,
		},
	],
	tags: [
		{
			type: Schema.Types.ObjectId,
			ref: Tag,
			required: [true, "At least one Tag is required!"],
		},
	],
	creator: {
		type: Schema.Types.ObjectId,
		ref: User,
	},
});

const Project = models.Project || model("Project", ProjectSchema);
export default Project;
