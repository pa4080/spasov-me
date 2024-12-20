import { type Model, Schema, model, models } from "mongoose";

import { aboutEntryTuple, cityTuple, countryTuple } from "@/interfaces/_common-data-types";
import { type AboutEntryDoc } from "@/interfaces/AboutEntry";

import Tag from "./tag";
import User from "./user";

const AboutEntrySchema = new Schema<AboutEntryDoc>({
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
    enum: countryTuple,
    required: [true, "The county is required!"],
  },
  city: {
    type: String,
    enum: cityTuple,
    required: [true, "The city is required!"],
  },
  entryType: {
    type: String,
    enum: aboutEntryTuple,
    default: aboutEntryTuple[0],
    required: [true, "Type is required!"],
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
  creator: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  attachment: {
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
});

export type AboutEntryModel = Model<AboutEntryDoc>;

const AboutEntry =
  (models.AboutEntry as AboutEntryModel) || model<AboutEntryDoc>("AboutEntry", AboutEntrySchema);

export default AboutEntry;
