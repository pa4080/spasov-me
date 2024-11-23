/**
 * For internationalization, for example,
 * you can use the following package:
 * @see https://github.com/alexsk/mongoose-intl
 */
import { type Model, Schema, model, models } from "mongoose";

import { type PageCardDoc } from "@/interfaces/PageCard";

import User from "./user";

const PageCardSchema = new Schema<PageCardDoc>({
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
  },
  icon: {
    type: String,
  },
});

export type PageCardModel = Model<PageCardDoc>;

const PageCard =
  (models.PageCard as PageCardModel) || model<PageCardDoc>("PageCard", PageCardSchema);
export default PageCard;
