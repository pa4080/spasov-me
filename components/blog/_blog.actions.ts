"use server";

import { getSession, process_relations, revalidatePaths } from "@/components/_common.actions";
import { type PostType } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import { type PostData, type PostDocPopulated } from "@/interfaces/Post";
import { postDocuments_toData, postFormData_toNewPostData } from "@/lib/process-data-posts";
import Post from "@/models/post";

export const getPosts = async ({
  hyphen,
  typeList,
  public: visible = false,
}: {
  hyphen?: boolean;
  typeList?: PostType[];
  public?: boolean;
}): Promise<PostData[] | null> => {
  try {
    await connectToMongoDb();
    const posts: PostDocPopulated[] = await Post.find({}).populate([
      "attachment",
      "tags",
      "gallery",
      "icon",
    ]);

    return postDocuments_toData({ posts, hyphen, typeList, visible });
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const createPost = async (data: FormData, paths: string[]): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Get the input data from the form
    const documentData_new = postFormData_toNewPostData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery", "icon"]);

    // Connect to the DB and create a new document
    await connectToMongoDb();
    const document_new = new Post(documentData_new);

    // Save the new document
    await document_new.save();

    await process_relations({
      documentData_new,
      document_new,
      modelType: "Post",
    });

    return true;
  } catch (error) {
    console.error("Unable to create new post", error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const updatePost = async (
  data: FormData,
  post_id: string,
  paths: string[]
): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Get the input data from the form
    const documentData_new = postFormData_toNewPostData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["dateTo"]);

    // Connect to the DB
    await connectToMongoDb();
    const document_prev = await Post.findOne({ _id: post_id });
    const document_new = await Post.findOneAndUpdate({ _id: post_id }, documentData_new, {
      new: true,
      strict: true,
    });

    await process_relations({
      documentData_new,
      document_new,
      document_prev,
      modelType: "Post",
    });

    // Deal with the "dateTo"
    if (!documentData_new.dateTo) {
      document_new.dateTo = undefined;
    }

    // Save the document with the changes above
    await document_new.save();

    return true;
  } catch (error) {
    console.error("Unable to update post", error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const deletePost = async (post_id: string, paths: string[]): Promise<boolean> => {
  try {
    if (!(await getSession())?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Connect to the DB and delete the post
    await connectToMongoDb();
    const document_deleted = await Post.findOneAndDelete({ _id: post_id });

    await process_relations({
      document_prev: document_deleted,
      modelType: "Post",
    });

    return !!document_deleted;
  } catch (error) {
    console.error("Unable to delete post", error);

    return false;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};
