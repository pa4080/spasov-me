"use server";

import { ObjectId } from "mongodb";

import {
  attachedTo_detachFromTarget,
  getSession,
  revalidatePaths,
} from "@/components/_common.actions";
import { type TagData, type TagDoc } from "@/interfaces/Tag";
import { type AttachedToDocument } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { tagDocuments_toData, tagFormData_toNewTagData } from "@/lib/process-data-tags";
import { msgs } from "@/messages";
import Tag from "@/models/tag";

export const getTags = async ({
  public: visible,
  hyphen = false,
  sorted = true,
}: {
  public?: boolean;
  hyphen?: boolean;
  sorted?: boolean;
} = {}): Promise<TagData[] | null> => {
  try {
    await connectToMongoDb();
    const tags: TagDoc[] = await Tag.find({});

    return tagDocuments_toData({ tags, visible, hyphen, sorted });
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const createTag = async (data: FormData, paths: string[]): Promise<true | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    await connectToMongoDb();

    const documentData_new = tagFormData_toNewTagData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new);

    const newTagDocument = new Tag(documentData_new);

    await newTagDocument.save();

    return true;
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const updateTag = async (
  data: FormData,
  tag_id: string,
  paths: string[]
): Promise<true | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    const documentData_new = tagFormData_toNewTagData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new);

    await connectToMongoDb();
    const document_prev = await Tag.findOne({ _id: tag_id });
    const document_new = await Tag.findOneAndUpdate({ _id: tag_id }, documentData_new, {
      new: true,
      strict: true,
    });

    // Process the "attachedTo" array first
    await attachedTo_detachFromTarget({
      attachedToArr_new: documentData_new?.attachedTo,
      attachedToArr_old: document_prev.toObject()?.attachedTo,
      target_id: tag_id,
    });

    if (!documentData_new?.attachedTo) {
      document_new.attachedTo = undefined;
    }

    await document_new.save();

    return true;
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const deleteTag = async (tag_id: string, paths: string[]): Promise<true | null> => {
  try {
    if (!(await getSession())?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    await connectToMongoDb();

    const document_deleted = await Tag.findOneAndDelete({ _id: tag_id });

    return !!document_deleted ? true : null;
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

/**
 * This function is used within the other documents,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to ADD the relevant "attachedTo" item to a Tag.
 */
export const tagAttachment_add = async ({
  documentToAttach,
  target_tag_id,
}: {
  documentToAttach: AttachedToDocument;
  target_tag_id: string;
}): Promise<boolean> => {
  try {
    await connectToMongoDb();
    const target_tag_ObjectId = new ObjectId(target_tag_id);
    const dbTagDoc = (await Tag.findOne(target_tag_ObjectId)).toObject() as TagDoc;
    const attachedTo = dbTagDoc.attachedTo! || [];

    // Check if the document is already attached
    if (!!attachedTo.find(({ _id }: { _id: string }) => _id === documentToAttach._id)) {
      return true;
    }

    const newAttachedTo = [...attachedTo, documentToAttach];

    const result = await Tag.updateOne(
      { _id: target_tag_ObjectId },
      {
        $set: {
          attachedTo: newAttachedTo,
        },
      }
    );

    return !!result;
  } catch (error) {
    console.error("Unable to add attached document to a Tag: ", error);

    return false;
  }
};

/**
 * This function is used within the other documents,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to REMOVE the relevant "attachedTo" item from a Tag.
 */
export const tagAttachment_remove = async ({
  attachedDocument_id,
  target_tag_id,
}: {
  attachedDocument_id: string;
  target_tag_id: string;
}): Promise<boolean> => {
  try {
    await connectToMongoDb();
    const target_tag_ObjectId = new ObjectId(target_tag_id);
    const dbTagDoc = (await Tag.findOne(target_tag_ObjectId)).toObject() as TagDoc;
    const attachedTo = dbTagDoc.attachedTo! || [];

    const result = await Tag.updateOne(
      { _id: target_tag_ObjectId },
      {
        $set: {
          attachedTo: attachedTo.filter(({ _id }: { _id: string }) => _id !== attachedDocument_id),
        },
      }
    );

    return !!result;
  } catch (error) {
    console.error("Unable to remove attached document from a Tag: ", error);

    return false;
  }
};
