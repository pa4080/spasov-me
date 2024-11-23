"use server";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import {
  fileAttachment_add,
  fileAttachment_remove,
} from "@/components/files-cloudflare/_files.actions";
import { type PageCardData, type PageCardDocPopulated } from "@/interfaces/PageCard";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { PageCardDocuments_toData, pageFormData_toNewEntryData } from "@/lib/process-data-pages";
import { msgs } from "@/messages";
import PageCard from "@/models/page-card";

export const getPageCards = async ({
  public: visible,
  hyphen = false,
}: {
  public?: boolean;
  hyphen?: boolean;
} = {}): Promise<null | PageCardData[]> => {
  try {
    await connectToMongoDb();
    const pages: PageCardDocPopulated[] = await PageCard.find({});

    return PageCardDocuments_toData({ pages, visible, hyphen });
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const createPageCard = async (data: FormData, paths: string[]): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    const documentData_new = pageFormData_toNewEntryData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["attachment"]);

    // Connect to the DB and create a new document
    await connectToMongoDb();
    const document_new = new PageCard(documentData_new);

    // Save the new document
    await document_new.save();

    // Deal with the "attachment"
    if (documentData_new.attachment) {
      await fileAttachment_add({
        documentToAttach: {
          _id: document_new._id.toString(),
          title: document_new.title,
          modelType: "PageCard",
        },
        target_file_id: documentData_new.attachment,
        prefix: "all_prefixes",
      });
    }

    return true;
  } catch (error) {
    console.error("Unable to create new page card", error);

    return null;
  } finally {
    void revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const updatePageCard = async (
  data: FormData,
  page_id: string,
  paths: string[]
): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    const documentData_new = pageFormData_toNewEntryData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["attachment"]);

    // Connect to the DB and create a new document
    await connectToMongoDb();
    const document_prev = await PageCard.findOne({ _id: page_id });
    const document_new = await PageCard.findOneAndUpdate({ _id: page_id }, documentData_new, {
      new: true,
      strict: true,
    });

    // Deal with the "attachment" > remove the relation for the old file
    if (document_prev?.attachment) {
      await fileAttachment_remove({
        attachedDocument_id: document_prev._id.toString(),
        target_file_id: document_prev.attachment.toString(),
        prefix: "all_prefixes",
      });
    }

    if (!document_new) {
      throw new Error(msgs("Errors")("mongoDbEntryNotFound", { id: page_id }));
    }

    // Deal with the "attachment" > add the relation for the new file
    if (documentData_new.attachment) {
      await fileAttachment_add({
        documentToAttach: {
          _id: document_new._id.toString(),
          title: document_new.title,
          modelType: "PageCard",
        },
        target_file_id: documentData_new.attachment,
        prefix: "all_prefixes",
      });
    } else {
      document_new.attachment = undefined;
    }

    // Save the new document
    await document_new.save();

    return true;
  } catch (error) {
    console.error("Unable to update page card", error);

    return null;
  } finally {
    void revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const deletePageCard = async (page_id: string, paths: string[]): Promise<boolean> => {
  try {
    if (!(await getSession())?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Connect to the DB and delete the entry
    await connectToMongoDb();
    const document_deleted = await PageCard.findOneAndDelete({ _id: page_id });

    if (!document_deleted) {
      throw new Error(msgs("Errors")("mongoDbEntryNotFound", { id: page_id }));
    }

    // Deal with the "attachment"
    if (document_deleted.attachment) {
      await fileAttachment_remove({
        attachedDocument_id: document_deleted._id.toString(),
        target_file_id: document_deleted.attachment.toString(),
        prefix: "all_prefixes",
      });
    }

    return !!document_deleted;
  } catch (error) {
    console.error("Unable to delete entry", error);

    return false;
  } finally {
    void revalidatePaths({ paths, redirectTo: paths[0] });
  }
};
