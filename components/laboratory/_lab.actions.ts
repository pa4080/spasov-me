"use server";

import { getSession, process_relations, revalidatePaths } from "@/components/_common.actions";
import { type LabEntryType } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import { type LabEntryData, type LabEntryDocPopulated } from "@/interfaces/LabEntry";
import {
  labEntryDocuments_toData,
  labEntryFormData_toNewLabEntryData,
} from "@/lib/process-data-lab-entries";
import LabEntry from "@/models/lab-entry";

export const getLabEntries = async ({
  hyphen,
  typeList,
  public: visible = false,
}: {
  hyphen?: boolean;
  typeList?: LabEntryType[];
  public?: boolean;
}): Promise<LabEntryData[] | null> => {
  try {
    await connectToMongoDb();
    const labEntries: LabEntryDocPopulated[] = await LabEntry.find({}).populate([
      "attachment",
      "tags",
      "gallery",
      "icon",
    ]);

    return labEntryDocuments_toData({ labEntries: labEntries, hyphen, typeList, visible });
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const createLabEntry = async (data: FormData, paths: string[]): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Get the input data from the form
    const documentData_new = labEntryFormData_toNewLabEntryData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery", "icon"]);

    // Connect to the DB and create a new document
    await connectToMongoDb();
    const document_new = new LabEntry(documentData_new);

    // Save the new document
    await document_new.save();

    await process_relations({
      documentData_new,
      document_new,
      modelType: "LabEntry",
      gallery_mongo: true,
      attachment_mongo: true,
    });

    return true;
  } catch (error) {
    console.error("Unable to create a new ;ab-entry", error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const updateLabEntry = async (
  data: FormData,
  labEntry_id: string,
  paths: string[]
): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Get the input data from the form
    const documentData_new = labEntryFormData_toNewLabEntryData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["dateTo"]);

    // Connect to the DB
    await connectToMongoDb();
    const document_prev = await LabEntry.findOne({ _id: labEntry_id });
    const document_new = await LabEntry.findOneAndUpdate({ _id: labEntry_id }, documentData_new, {
      new: true,
      strict: true,
    });

    await process_relations({
      documentData_new,
      document_new,
      document_prev,
      modelType: "LabEntry",
      gallery_mongo: true,
      attachment_mongo: true,
    });

    // Deal with the "dateTo"
    if (!documentData_new.dateTo) {
      document_new.dateTo = undefined;
    }

    // Save the document with the changes above
    await document_new.save();

    return true;
  } catch (error) {
    console.error("Unable to update a lab-entry", error);

    return null;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const deleteLabEntry = async (labEntry_id: string, paths: string[]): Promise<boolean> => {
  try {
    if (!(await getSession())?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Connect to the DB and delete the lab-entry
    await connectToMongoDb();
    const document_deleted = await LabEntry.findOneAndDelete({ _id: labEntry_id });

    await process_relations({
      document_prev: document_deleted,
      modelType: "LabEntry",
      gallery_mongo: true,
      attachment_mongo: true,
    });

    return !!document_deleted;
  } catch (error) {
    console.error("Unable to delete a lab-entry", error);

    return false;
  } finally {
    revalidatePaths({ paths, redirectTo: paths[0] });
  }
};
