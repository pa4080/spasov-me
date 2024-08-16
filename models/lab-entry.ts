import { Schema, model, models } from "mongoose";

import {
	labEntryAccessTuple,
	labEntryHostTuple,
	labEntryLocationTuple,
	labEntryPropertyTuple,
	labEntryTuple,
	labEntryVisibilityTuple,
} from "@/interfaces/_common-data-types";

import Tag from "./tag";
import User from "./user";

const LabEntrySchema = new Schema({
	title: {
		type: String,
		required: [true, "Title is required!"],
	},
	description: {
		type: String,
		required: [true, "Description is required!"],
	},
	slug: {
		type: String,
		required: [true, "The slug is required!"],
		match: [/^[a-z][a-z0-9-]*$/, "The slug must be in kebab case!"],
	},
	entryType: {
		type: String,
		enum: labEntryTuple,
		default: labEntryTuple[0],
		required: [true, "Type is required!"],
	},
	visibilityType: {
		type: String,
		enum: labEntryVisibilityTuple,
		default: labEntryVisibilityTuple[0],
		required: [true, "Visibility type is required!"],
	},
	propertyType: {
		type: String,
		enum: labEntryPropertyTuple,
		default: labEntryPropertyTuple[0],
		required: [true, "Property type is required!"],
	},
	hostType: {
		type: String,
		enum: labEntryHostTuple,
		default: labEntryHostTuple[0],
		required: [true, "Host type is required!"],
	},
	locationType: {
		type: String,
		enum: labEntryLocationTuple,
		default: labEntryLocationTuple[0],
		required: [true, "Location type is required!"],
	},
	accessType: {
		type: String,
		enum: labEntryAccessTuple,
		default: labEntryAccessTuple[0],
		required: [true, "Access type is required!"],
	},
	urlHome: {
		type: String,
		required: [false, "The lab entry's home url is not required!"],
	},
	urlAdmin: {
		type: String,
		required: [false, "The lab entry's admin url is not required!"],
	},
	urlSource: {
		type: String,
		required: [false, "The repository/source url is not required!"],
	},
	dateFrom: {
		type: Date,
		required: [true, "Date 'from' is required!"],
	},
	dateTo: {
		type: Date, // it is not required, so when it is not defined the frontend will display "Now"
	},
	visibility: {
		type: Boolean,
		required: [true, "Visibility is required!"],
	},
	attachment: {
		type: String,
	},
	icon: {
		type: String,
	},
	gallery: [
		{
			type: String,
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

const LabEntry = models.LabEntry || model("Project", LabEntrySchema);
export default LabEntry;
