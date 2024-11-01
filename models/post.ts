import { Schema, model, models } from "mongoose";

import { postTuple } from "@/interfaces/_common-data-types";

import Tag from "./tag";
import User from "./user";

const PostSchema = new Schema({
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
    enum: postTuple,
    default: postTuple[0],
    required: [true, "Type is required!"],
  },
  url1: {
    type: String,
    required: [false, "Reference URL 1 - not required!"],
  },
  url2: {
    type: String,
    required: [false, "Reference URL 2 - not required!"],
  },
  dateFrom: {
    type: Date,
    required: [true, "Date 'from' is required!"],
  },
  dateTo: {
    type: Date, // it is not required, so when it is not defined the frontend will display "Now"
  },
  galleryDisplay: {
    type: Boolean,
    required: [true, "Gallery display is required!"], // default true
  },
  galleryNav: {
    type: Boolean,
    required: [true, "Gallery navigation visibility is required!"], // default false
  },
  galleryCaptions: {
    type: Boolean,
    required: [true, "Gallery captions visibility is required!"], // default true
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

const Post = models.Post || model("Post", PostSchema);
export default Post;
