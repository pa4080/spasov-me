import { type Model, Schema, model, models } from "mongoose";

import { projectTuple } from "@/interfaces/_common-data-types";
import { type ProjectDoc } from "@/interfaces/Project";

import Tag from "./tag";
import User from "./user";

const ProjectSchema = new Schema<ProjectDoc>({
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
    enum: projectTuple,
    default: projectTuple[0],
    required: [true, "Type is required!"],
  },
  urlHome: {
    type: String,
    required: [false, "The project's home url is not required!"],
  },
  urlAdmin: {
    type: String,
    required: [false, "The project's admin url is not required!"],
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

export type ProjectModel = Model<ProjectDoc>;

const Project = (models.Project as ProjectModel) || model<ProjectDoc>("Project", ProjectSchema);
export default Project;
