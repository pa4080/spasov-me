"use server";

// import { Redis } from "@upstash/redis";
import { createClient } from "@vercel/kv";
import { ObjectId } from "mongodb";
import { type HydratedDocument } from "mongoose";

import { type AttachedToDocument, regexFilesAll } from "@/interfaces/_common-data-types";
import { type FileData, type FileDoc, type FileListItem } from "@/interfaces/File";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb, defaultChunkSize, gridFSBucket } from "@/lib/mongodb-mongoose";
import { fileDocuments_toData } from "@/lib/process-data-files-mongodb";
import { msgs } from "@/messages";
import FileGFS from "@/models/file";
import { Route } from "@/routes";

import { attachedTo_detachFromTarget, getSession, revalidatePaths } from "../_common.actions";

import { Readable } from "stream";

// const redis = new Redis({
// 	url: process.env.UPSTASH_REDIS_REST_URL,
// 	token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

const redis = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const MONGO_REDIS_PREFIX = "mongo_db_files";

export const getFilesV1 = async (): Promise<FileData[] | null> => {
  try {
    /**
     * This version of the function causes the following error at the build time:
     *
     * > TypeError: Cannot read properties of undefined (reading 'collection')
     * > at new GridFSBucket (/config/workspace/spasov-me/node_modules/.pnpm/mongodb@6.2.0/node_modules/mongodb/lib/gridfs/index.js:29:35)
     * > at f (/config/workspace/spasov-me/.next/server/chunks/843.js:1:16624)
     * > at async m (/config/workspace/spasov-me/.next/server/app/admin/files/page.js:1:32576)
     * > at async Z (/config/workspace/spasov-me/.next/server/app/admin/files/page.js:1:32099
     *
     * It is interesting on Vercel this error does not occur!
     */
    const bucket = await gridFSBucket();

    if (!bucket) {
      throw new Error("Invalid GridFS bucket");
    }

    const files = (await bucket.find().toArray()) as FileDoc[];

    if (files?.length === 0) {
      return null;
    }

    return fileDocuments_toData({ files });
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getFiles_mongo = async ({
  hyphen = true,
  public: visible = false,
}: {
  hyphen?: boolean;
  public?: boolean;
} = {}): Promise<FileData[] | null> => {
  try {
    const cachedFiles = await redis.get<FileData[]>(MONGO_REDIS_PREFIX);

    if (cachedFiles) {
      return cachedFiles;
    }

    await connectToMongoDb();
    const files = await FileGFS.find<HydratedDocument<FileDoc>>();

    if (files?.length === 0) {
      return null;
    }

    const filesProcessed = fileDocuments_toData({
      files: files.map((file) => file.toObject()),
      hyphen,
      visible,
    });

    // Set the "files"/"icons" array in Redis
    await redis.set(MONGO_REDIS_PREFIX, JSON.stringify(filesProcessed));

    return filesProcessed;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getFileList_mongo = async ({ images }: { images?: boolean } = {}): Promise<
  FileListItem[] | null
> => {
  const files = await getFiles_mongo();

  if (!files || files?.length === 0) {
    return null;
  }

  let filteredFiles = files;

  if (images) {
    filteredFiles = files.filter((file) => file.filename.match(regexFilesAll));
  }

  return filteredFiles.map((file) => ({
    value: file._id.toString(),
    label: file.filename,
    sourceImage: `${Route.api.FILES_MONGODB}/${file._id.toString()}/${
      file.filename
    }?v=${new Date(file.uploadDate).getTime()}`,
    sourceDescription: file.filename,
  }));
};

export const createFile_mongo = async (data: FormData, paths: string[]): Promise<true | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // connect to the database and get the bucket
    const bucket = await gridFSBucket();

    if (!bucket) {
      throw new Error("Invalid GridFS bucket");
    }

    /**
		 * This is much inconvenient approach.
		 * Because we cannot process in a loop in our case...
		 *
		const formEntries = Array.from(data.entries());
		const description = formEntries.find((entry) => entry[0] === "description")?.[1] as string;
		const file_name = formEntries.find((entry) => entry[0] === "name")?.[1] as string;
		const user_id = formEntries.find((entry) => entry[0] === "user_id")?.[1] as string;
		const file_form_field = formEntries.find((entry) => entry[0] === "file")?.[1];
		 */

    const file = data.get("file") as File;
    const description = data.get("description") as string;
    const file_name = data.get("filename") as string;
    const user_id = session?.user.id;

    if (typeof file === "object") {
      // Override the original filename
      const filename = file_name || file.name;

      // Convert the blob to stream
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      const uploadStream = bucket.openUploadStream(filename, {
        // Make sure to add content type so that it will be easier to set later.
        metadata: {
          description,
          creator: new ObjectId(user_id),
          size: file.size,
          contentType: file.type,
          lastModified: file.lastModified,
          originalName: file.name,
        },
        chunkSizeBytes: file.size < defaultChunkSize ? file.size + 4 : defaultChunkSize,
      });

      if (!uploadStream) {
        throw new Error(msgs("Errors")("invalidFile"));
      }

      // Pipe the readable stream to a writeable stream to save it to the database
      const dbObject = stream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      // Flush the cache
      await redis.del(MONGO_REDIS_PREFIX);

      return dbObject.id ? true : null;
    } else {
      console.error(msgs("Errors")("invalidFile"));

      return null;
    }
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    await revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const updateFile_mongo = async (
  data: FormData,
  file_id: string,
  paths: string[]
): Promise<true | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Generate the ObjectId, connect to the db and get the bucket
    await connectToMongoDb();
    const _id = new ObjectId(file_id);
    const document = await FileGFS.findOne<HydratedDocument<FileDoc>>(_id);
    const bucket = await gridFSBucket();

    if (!document) {
      throw new Error(msgs("Errors")("invalidFile", { id: file_id }));
    }

    const user_id = session?.user.id;
    const file = data.get("file") as File;
    const documentData_new = {
      description: data.get("description") as string,
      file_name: data.get("filename") as string,
      attachedTo: JSON.parse(data.get("attachedTo") as string) as AttachedToDocument[],
      visibility: data.get("visibility") as string,
    };

    deleteFalsyKeys(documentData_new);

    // Process the "attachedTo" array first
    await attachedTo_detachFromTarget({
      attachedToArr_new: documentData_new.attachedTo,
      attachedToArr_old: document.toObject().metadata.attachedTo,
      target_id: file_id,
    });

    // Process the "file" itself --- TODO: uncomment the lines related to attachedTo
    if (typeof file === "object") {
      /**
       * In this case we need to replace the file itself,
       * so firs we need to remove it from the database, and
       * then we need to create a new one with the same _id.
       */

      // Remove the file from the database
      await bucket.delete(_id);

      // Override the original filename
      const filename = documentData_new.file_name || file.name;

      // Convert the blob to stream
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      const uploadStream = bucket.openUploadStreamWithId(_id, filename, {
        // Make sure to add content type so that it will be easier to set later.
        metadata: {
          description: documentData_new.description || document.metadata?.description,
          creator: new ObjectId(user_id),
          size: file.size,
          contentType: file.type,
          lastModified: file.lastModified,
          originalName: file.name,
          visibility: documentData_new.visibility || document.metadata?.visibility,
          attachedTo: documentData_new.attachedTo || document.metadata?.attachedTo,
        },
        chunkSizeBytes: file.size < defaultChunkSize ? file.size + 4 : defaultChunkSize,
      });

      if (!uploadStream) {
        throw new Error(msgs("Errors")("invalidFile"));
      }

      // Pipe the readable stream to a writeable stream to save it to the database
      const dbObject = stream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      return dbObject.id ? true : null;
    } else {
      /**
       * In this case we only need to update the "metadata", and/or the "filename".
       * So we do not need to create a new file and stream its content.
       */

      if (document.metadata?.description !== documentData_new?.description) {
        document.metadata.description = documentData_new.description;
        await document.save();
      }

      if (document.metadata?.visibility !== documentData_new?.visibility) {
        document.metadata.visibility = documentData_new.visibility;
        await document.save();
      }

      if (documentData_new.attachedTo !== document.toObject().metadata.attachedTo) {
        document.metadata = {
          ...document.toObject().metadata,
          attachedTo: documentData_new.attachedTo,
        };

        await document.save();
      }

      if (document.filename !== documentData_new?.file_name) {
        await bucket.rename(_id, documentData_new.file_name);
      }

      // Flush the cache
      await redis.del(MONGO_REDIS_PREFIX);

      return true;
    }
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    await revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const deleteFile_mongo = async (file_id: string, paths: string[]): Promise<true | null> => {
  try {
    if (!(await getSession())?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    const bucket = await gridFSBucket();

    if (!bucket) {
      throw new Error("Invalid GridFS bucket");
    }

    const _id = new ObjectId(file_id);

    // Just check if does the file exists
    const files = await bucket.find({ _id }).toArray();

    if (files?.length === 0) {
      return null;
    }

    // Do the actual remove
    await bucket.delete(_id);
    // Flush the cache
    await redis.del(MONGO_REDIS_PREFIX);

    return true;
  } catch (error) {
    console.error(error);

    return null;
  } finally {
    await revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

/**
 * This function is used within the other documents,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to ADD the relevant "attachedTo" item to a File.
 */
export const fileAttachment_add_mongo = async ({
  documentToAttach,
  target_file_id,
}: {
  documentToAttach: AttachedToDocument;
  target_file_id: string;
}): Promise<boolean> => {
  try {
    await connectToMongoDb();
    const target_file_ObjectId = new ObjectId(target_file_id);
    const dbFileGFSRaw = await FileGFS.findOne<HydratedDocument<FileDoc>>(target_file_ObjectId);

    if (!dbFileGFSRaw) {
      throw new Error(msgs("Errors")("invalidFile", { id: target_file_id }));
    }

    const dbFileGFSDoc = dbFileGFSRaw?.toObject();
    const attachedTo = dbFileGFSDoc.metadata.attachedTo! || [];

    // Check if the document is already attached
    if (!!attachedTo.find(({ _id }: { _id: string }) => _id === documentToAttach._id)) {
      return true;
    }

    return !!(await FileGFS.updateOne(
      { _id: target_file_ObjectId },
      {
        $set: {
          "metadata.attachedTo": [
            ...attachedTo,
            {
              modelType: documentToAttach.modelType,
              title: documentToAttach.title,
              _id: documentToAttach._id,
            },
          ],
        },
      }
    ));
  } catch (error) {
    console.error("Unable to add attached document to a File: ", error);

    return false;
  } finally {
    // Flush the cache
    await redis.del(MONGO_REDIS_PREFIX);
  }
};

/**
 * This function is used within the other documents,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to REMOVE the relevant "attachedTo" item from a File.
 */
export const fileAttachment_remove_mongo = async ({
  attachedDocument_id,
  target_file_id,
}: {
  attachedDocument_id: string;
  target_file_id: string;
}): Promise<boolean> => {
  try {
    await connectToMongoDb();
    const target_file_ObjectId = new ObjectId(target_file_id);
    const dbFileGFSRaw = await FileGFS.findOne<HydratedDocument<FileDoc>>(target_file_ObjectId);

    if (!dbFileGFSRaw) {
      throw new Error(msgs("Errors")("invalidFile", { id: target_file_id }));
    }

    const dbFileGFSDoc = dbFileGFSRaw.toObject() as FileDoc;
    const attachedTo = dbFileGFSDoc.metadata.attachedTo! || [];

    return !!(await FileGFS.updateOne(
      { _id: target_file_ObjectId },
      {
        $set: {
          "metadata.attachedTo": attachedTo.filter(
            ({ _id }: { _id: string }) => _id !== attachedDocument_id
          ),
        },
      }
    ));
  } catch (error) {
    console.error("Unable to remove attached document from a File: ", error);

    return false;
  } finally {
    // Flush the cache
    await redis.del(MONGO_REDIS_PREFIX);
  }
};
