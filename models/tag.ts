import { type Model, Schema, model, models } from "mongoose";

import { tagTuple } from "@/interfaces/_common-data-types";
import { type TagDoc } from "@/interfaces/Tag";

import User from "./user";

const TagSchema = new Schema<TagDoc>({
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
  attachedTo: [], // AttachedToDocument[]; use [], otherwise we need to use: Schema > Model > Collection > ObjectIds

  creator: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
});

type TagModel = Model<TagDoc>;

const Tag = (models.Tag as TagModel) || model<TagDoc>("Tag", TagSchema);
export default Tag;
