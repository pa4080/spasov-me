"use server";

import { Redis } from "@upstash/redis";
import { type ObjectId } from "mongodb";
import { type HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import {
  fileAttachment_add,
  fileAttachment_remove,
} from "@/components/files-cloudflare/_files.actions";
import { tagAttachment_add, tagAttachment_remove } from "@/components/tags/_tags.actions";
import { type AboutEntryDoc, type NewAboutEntryData } from "@/interfaces/AboutEntry";
import { type LabEntryDoc, type NewLabEntryData } from "@/interfaces/LabEntry";
import { type NewPostData, type PostDoc } from "@/interfaces/Post";
import { type NewProjectData, type ProjectDoc } from "@/interfaces/Project";
import { type AttachedToDocument, type ModelType } from "@/interfaces/_common-data-types";
import { arraysEqual } from "@/lib/arrays-equal";
import { arraysEqualDiff } from "@/lib/arrays-equal-diff";
import { authOptions } from "@/lib/auth-options";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import AboutEntry, { type AboutEntryModel } from "@/models/about-entry";
import LabEntry, { type LabEntryModel } from "@/models/lab-entry";
import PageCard, { type PageCardModel } from "@/models/page-card";
import Post, { type PostModel } from "@/models/post";
import Project, { type ProjectModel } from "@/models/project";

import {
  fileAttachment_add_mongo,
  fileAttachment_remove_mongo,
} from "./files-mongodb/_files.actions";

const redis_app_prefix = process.env.UPSTASH_REDIS_PREFIX ?? "spasov_me";
const files_prefix_mongo = process.env.MONGO_REDIS_PREFIX ?? "mongo_db_files";
const files_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES ?? "files";
const icons_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS ?? "icons";
const icons_map_prefix = "iconsMap";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const redisCacheFile_Flush = async (key: "all" | "files" | "icons" | "files_mongo") => {
  switch (key) {
    case "all":
      await Promise.all([
        redis.del(`${redis_app_prefix}_${files_prefix}`),
        redis.del(`${redis_app_prefix}_${icons_prefix}`),
        redis.del(`${redis_app_prefix}_${icons_map_prefix}`),
        redis.del(`${redis_app_prefix}_${files_prefix_mongo}`),
      ]);
      break;
    case "files":
      await redis.del(`${redis_app_prefix}_${files_prefix}`);
      break;
    case "icons":
      await Promise.all([
        redis.del(`${redis_app_prefix}_${icons_prefix}`),
        redis.del(`${redis_app_prefix}_${icons_map_prefix}`),
      ]);
      break;
    case "files_mongo":
      await redis.del(`${redis_app_prefix}_${files_prefix_mongo}`);
      break;
  }
};

export const revalidatePaths = async <T extends string>({
  paths,
  files_prefixes = ["files", "icons", "iconsMap", "mongo_db_files"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  redirectTo,
}: {
  paths: T[];
  redirectTo?: T;
  files_prefixes?: string[] | null;
}): Promise<T[] | null | void> => {
  try {
    // Delete the "files"/"icons" array from Redis in order to be updated on the next request
    if (files_prefixes && files_prefixes.length > 0) {
      files_prefixes.forEach((prefix) => {
        // await redis.del(prefix);
        void redis.del(prefix);
      });
    }

    paths.forEach((path) => {
      revalidatePath(path);
    });

    return paths;
  } catch (error) {
    console.error(error);

    return null;
  }
  /**
	 * redirect() cause a specific Next.js error, so it must be outside the try block!
	 * Actually the errors generates by redirect() causes internal server error in production.
	 * We are refreshing the page via a client side component @see ServerActionResponseNotify.tsx
	 *
	 finally {
	 	if (redirectTo) {
	 		setTimeout(() => redirect(redirectTo), 1000);
	 	}
	 }
	 */
};

export const getSession = async () => {
  const session = await getServerSession(authOptions);

  return session;
};

/**
 * Trigger the Vercel's rebuild hook
 */
interface VercelRebuildResponse {
  job: { id: string; state: string; createdAt: number };
}

export const vercelRebuildMaster = async (): Promise<null | VercelRebuildResponse> => {
  try {
    const hookUrl = process.env.VERCEL_HOOK_REBUILD_MASTER;

    if (hookUrl) {
      const response = await fetch(hookUrl);

      if (response.ok) {
        return response.json() as Promise<VercelRebuildResponse>;
      }
    }

    return null;
  } catch (error) {
    console.error(error);

    return null;
  }
};

/**
 * This function is used within the File and Tag forms,
 * to DETACH (REMOVE) an "attachedTo" items.
 * So far the function is used only within
 * "fileUpdate()" and "tagUpdate()".
 */
export const attachedTo_detachFromTarget = async ({
  attachedToArr_new,
  attachedToArr_old,
  target_id,
}: {
  attachedToArr_new: AttachedToDocument[] | undefined;
  attachedToArr_old: AttachedToDocument[] | undefined;
  target_id: string;
}): Promise<boolean> => {
  try {
    // Init an empty array for the differences
    let attachedTo_diff: AttachedToDocument[] = [];

    // If all attachedTo items are removed
    if (
      attachedToArr_old &&
      attachedToArr_old?.length > 0 &&
      (!attachedToArr_new || attachedToArr_new?.length === 0)
    ) {
      attachedTo_diff = attachedToArr_old;
    }

    // If partially "attachedTo" items are removed
    if (
      attachedToArr_old &&
      attachedToArr_old?.length > 0 &&
      attachedToArr_new &&
      attachedToArr_new?.length > 0
    ) {
      const attachedToArr_new_ids = attachedToArr_new.map(({ _id }) => _id);

      attachedTo_diff = attachedToArr_old.filter(({ _id }) => !attachedToArr_new_ids.includes(_id));
    }

    // If "attachedTo" array is not changed
    if (attachedTo_diff.length === 0) {
      return true;
    }

    // If there are differences, process them.
    await connectToMongoDb();

    if (attachedTo_diff.length > 0) {
      await Promise.all(
        attachedTo_diff.map(async ({ _id, modelType }: { _id: string; modelType: ModelType }) => {
          let dbDocument:
            | HydratedDocument<AboutEntryModel>
            | HydratedDocument<PageCardModel>
            | HydratedDocument<ProjectModel>
            | HydratedDocument<PostModel>
            | HydratedDocument<LabEntryModel>
            | null;

          switch (modelType) {
            case "AboutEntry": {
              dbDocument = await AboutEntry.findOne({ _id });
              break;
            }

            case "PageCard": {
              dbDocument = await PageCard.findOne({ _id });
              break;
            }

            case "Project": {
              dbDocument = await Project.findOne({ _id });
              break;
            }

            case "Post": {
              dbDocument = await Post.findOne({ _id });
              break;
            }

            case "LabEntry": {
              dbDocument = await LabEntry.findOne({ _id });
              break;
            }

            default: {
              dbDocument = null;
              break;
            }
          }

          if (dbDocument) {
            if (
              "attachment" in dbDocument &&
              dbDocument.attachment &&
              dbDocument.attachment === target_id
            ) {
              dbDocument.attachment = undefined;
            }

            if ("icon" in dbDocument && dbDocument.icon && dbDocument.icon === target_id) {
              dbDocument.icon = undefined;
            }

            if (
              "gallery" in dbDocument &&
              dbDocument.gallery &&
              Array.isArray(dbDocument.gallery) &&
              dbDocument.gallery.length > 0
            ) {
              dbDocument.gallery = dbDocument.gallery.filter(
                (gallery_file_id: ObjectId) => gallery_file_id.toString() !== target_id
              );
            }

            if (
              "tags" in dbDocument &&
              dbDocument.tags &&
              Array.isArray(dbDocument.tags) &&
              dbDocument.tags.length > 0
            ) {
              dbDocument.tags = dbDocument.tags.filter(
                (tag_id: ObjectId) => tag_id.toString() !== target_id
              );
            }

            await dbDocument.save();
          } else {
            console.warn(
              `The DB document with Id '${_id}' does not exist.\n > ` +
                `It is safe to remove the relevant record from the ` +
                `'attachedTo' array of '${target_id}'.`
            );
          }
        })
      );
    }

    return true;
  } catch (error) {
    console.error("Unable to remove attached document", error);

    return false;
  }
};

/**
 * Process the relations between the models - attachedTo, gallery, tags
 */
export const process_relations = async ({
  documentData_new,
  document_new,
  document_prev,
  modelType,
  attachment_mongo = false,
  gallery_mongo = false,
}: {
  documentData_new?: NewAboutEntryData | NewProjectData | NewPostData | NewLabEntryData;
  document_new?: AboutEntryDoc | ProjectDoc | PostDoc | LabEntryDoc;
  document_prev?: AboutEntryDoc | ProjectDoc | PostDoc | LabEntryDoc;
  modelType: ModelType;
  attachment_mongo?: boolean;
  gallery_mongo?: boolean;
}) => {
  const updateAttachment = !arraysEqual(
    [document_prev?.attachment ?? ""],
    [document_new?.attachment ?? ""]
  );

  const updateIcon = !arraysEqual(
    [document_prev && "icon" in document_prev ? (document_prev.icon ?? "") : ""],
    [document_new && "icon" in document_new ? (document_new.icon ?? "") : ""]
  );

  const [galleryEqual, galleryDiff_remove, galleryDiff_add] = arraysEqualDiff(
    document_prev?.gallery,
    document_new?.gallery
  );

  const updateGallery = !galleryEqual;

  // Deal with the previous state of the document
  if (document_prev) {
    // Deal with the "attachment"
    if (updateAttachment) {
      if (document_prev?.attachment && document_prev?.attachment !== "undefined") {
        if (attachment_mongo) {
          await fileAttachment_remove_mongo({
            attachedDocument_id: document_prev._id.toString(),
            target_file_id: document_prev.attachment,
          });
        } else {
          await fileAttachment_remove({
            attachedDocument_id: document_prev._id.toString(),
            target_file_id: document_prev.attachment,
            prefix: "all_prefixes",
          });
        }
      }
    }

    // Deal with the "icon"
    if (updateIcon) {
      if ("icon" in document_prev && document_prev?.icon && document_prev?.icon !== "undefined") {
        await fileAttachment_remove({
          attachedDocument_id: document_prev._id.toString(),
          target_file_id: document_prev.icon,
          prefix: "all_prefixes",
        });
      }
    }

    // Deal with the "gallery"
    if (updateGallery) {
      if (galleryDiff_remove.length > 0) {
        await Promise.all(
          galleryDiff_remove.map(async (file_id: string) => {
            if (gallery_mongo) {
              await fileAttachment_remove_mongo({
                attachedDocument_id: document_prev._id.toString(),
                target_file_id: file_id,
              });
            } else {
              await fileAttachment_remove({
                attachedDocument_id: document_prev._id.toString(),
                target_file_id: file_id,
                prefix: "all_prefixes",
              });
            }
          })
        );
      }
    }

    // Deal with the "tags"
    if (document_prev.tags && document_prev.tags.length > 0) {
      await Promise.all(
        document_prev.tags.map(async (tag_id: ObjectId) => {
          await tagAttachment_remove({
            attachedDocument_id: document_prev._id.toString(),
            target_tag_id: tag_id.toString(),
          });
        })
      );
    }
  }

  // Deal with the current state of the document
  if (documentData_new && document_new) {
    // Deal with the "attachment"
    if (updateAttachment) {
      if (documentData_new?.attachment && documentData_new?.attachment !== "undefined") {
        if (attachment_mongo) {
          await fileAttachment_add_mongo({
            documentToAttach: {
              _id: document_new._id.toString(),
              title: document_new.title,
              modelType: modelType,
            },
            target_file_id: documentData_new.attachment,
          });
        } else {
          await fileAttachment_add({
            documentToAttach: {
              _id: document_new._id.toString(),
              title: document_new.title,
              modelType: modelType,
            },
            target_file_id: documentData_new.attachment,
            prefix: "all_prefixes",
          });
        }
      } else {
        document_new.attachment = undefined;
      }
    }

    // Deal with the "icon"
    if (updateIcon) {
      if (
        "icon" in documentData_new &&
        documentData_new?.icon &&
        documentData_new?.icon !== "undefined"
      ) {
        await fileAttachment_add({
          documentToAttach: {
            _id: document_new._id.toString(),
            title: document_new.title,
            modelType: modelType,
          },
          target_file_id: documentData_new.icon,
          prefix: "all_prefixes",
        });
      } else {
        (document_new as ProjectDoc).icon = undefined;
      }
    }

    // Deal with the "gallery"
    if (updateGallery) {
      if (galleryDiff_add.length > 0) {
        await Promise.all(
          galleryDiff_add.map(async (file_id) => {
            if (gallery_mongo) {
              await fileAttachment_add_mongo({
                documentToAttach: {
                  _id: document_new._id.toString(),
                  title: document_new.title,
                  modelType: modelType,
                },
                target_file_id: file_id,
              });
            } else {
              await fileAttachment_add({
                documentToAttach: {
                  _id: document_new._id.toString(),
                  title: document_new.title,
                  modelType: modelType,
                },
                target_file_id: file_id,
                prefix: "all_prefixes",
              });
            }
          })
        );
      }
    }

    // Deal with the "tags"
    if (documentData_new.tags && documentData_new.tags.length > 0) {
      await Promise.all(
        documentData_new.tags.map(async (tag_id) => {
          await tagAttachment_add({
            documentToAttach: {
              _id: document_new._id.toString(),
              title: document_new.title,
              modelType: modelType,
            },
            target_tag_id: tag_id,
          });
        })
      );
    } else {
      document_new.tags = undefined;
    }
  }
};
