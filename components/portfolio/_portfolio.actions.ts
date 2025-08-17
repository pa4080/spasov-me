"use server";

import { type HydratedDocument } from "mongoose";

import { getSession, process_relations, revalidatePaths } from "@/components/_common.actions";
import { type ProjectType } from "@/interfaces/_common-data-types";
import { type ProjectData, type ProjectDocPopulated } from "@/interfaces/Project";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import {
  projectDocuments_toData,
  projectFormData_toNewProjectData,
} from "@/lib/process-data-projects";
import { msgs } from "@/messages";
import Project from "@/models/project";

export const getProjects = async ({
  hyphen,
  typeList,
  public: visible = false,
}: {
  hyphen?: boolean;
  typeList?: ProjectType[];
  public?: boolean;
}): Promise<ProjectData[] | null> => {
  try {
    await connectToMongoDb();
    const projects: ProjectDocPopulated[] = await Project.find<
      HydratedDocument<ProjectDocPopulated>
    >({}).populate(["attachment", "tags", "gallery", "icon"]);

    return projectDocuments_toData({ projects, hyphen, typeList, visible });
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const getProjectList_SiteMap = async ({
  public: visible = true,
}: {
  public?: boolean;
} = {}): Promise<
  { title: string; slug: string; attachment?: string; gallery?: string[] }[] | null
> => {
  try {
    await connectToMongoDb();
    const projects = await Project.find(
      {
        visibility: visible,
      },
      { title: 1, slug: 1, attachment: 1, gallery: 1 }
    );

    return projects;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export const createProject = async (data: FormData, paths: string[]): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Get the input data from the form
    const documentData_new = projectFormData_toNewProjectData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery", "icon"]);

    // Connect to the DB and create a new document
    await connectToMongoDb();
    const document_new = new Project(documentData_new);

    // Save the new document
    await document_new.save();

    await process_relations({
      documentData_new,
      document_new,
      modelType: "Project",
    });

    return true;
  } catch (error) {
    console.error("Unable to create new project", error);

    return null;
  } finally {
    void revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const updateProject = async (
  data: FormData,
  project_id: string,
  paths: string[]
): Promise<boolean | null> => {
  try {
    const session = await getSession();

    if (!session?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Get the input data from the form
    const documentData_new = projectFormData_toNewProjectData({
      data,
      user_id: session?.user.id,
    });

    deleteFalsyKeys(documentData_new, ["dateTo"]);

    // Connect to the DB
    await connectToMongoDb();
    const document_prev = await Project.findOne({ _id: project_id });
    const document_new = await Project.findOneAndUpdate({ _id: project_id }, documentData_new, {
      new: true,
      strict: true,
    });

    if (!document_new || !document_prev) {
      throw new Error(msgs("Errors")("mongoDbEntryNotFound", { id: project_id }));
    }

    await process_relations({
      documentData_new,
      document_new,
      document_prev,
      modelType: "Project",
    });

    // Deal with the "dateTo"
    if (!documentData_new.dateTo) {
      document_new.dateTo = undefined;
    }

    // Save the document with the changes above
    await document_new.save();

    return true;
  } catch (error) {
    console.error("Unable to update project", error);

    return null;
  } finally {
    void revalidatePaths({ paths, redirectTo: paths[0] });
  }
};

export const deleteProject = async (project_id: string, paths: string[]): Promise<boolean> => {
  try {
    if (!(await getSession())?.user) {
      throw new Error(msgs("Errors")("invalidUser"));
    }

    // Connect to the DB and delete the project
    await connectToMongoDb();
    const document_deleted = await Project.findOneAndDelete({ _id: project_id });

    if (!document_deleted) {
      throw new Error(msgs("Errors")("mongoDbEntryNotFound", { id: project_id }));
    }

    await process_relations({
      document_prev: document_deleted,
      modelType: "Project",
    });

    return !!document_deleted;
  } catch (error) {
    console.error("Unable to delete project", error);

    return false;
  } finally {
    void revalidatePaths({ paths, redirectTo: paths[0] });
  }
};
