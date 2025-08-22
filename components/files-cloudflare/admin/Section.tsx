import React from "react";

import RevalidatePaths from "@/components/shared/RevalidatePaths";
import SectionHeader from "@/components/shared/SectionHeader";
import ToggleCollapsible from "@/components/shared/ToggleCollapsible";
import { type ModelType } from "@/interfaces/_common-data-types";
import { type FileData } from "@/interfaces/File";
import { hyphenateString } from "@/lib/process-text";
import { msgs } from "@/messages";

import FileCard from "../../shared/files/Card";
import styles from "../_files.module.css";
import CreateFile from "./Actions/CreateFile";

interface Props {
  className?: string;
  files: FileData[] | null | undefined;
  type?: ModelType | "common";
  visibleItems?: number;
  sortByAttachedTo?: boolean;
  sortByAttachedToVisibleItems?: number;
  files_prefix: string;
}

const Section: React.FC<Props> = ({
  className,
  files,
  type = "common",
  visibleItems = 2,
  sortByAttachedTo = true,
  sortByAttachedToVisibleItems = 25,
  files_prefix,
}) => {
  if (!files || files.length === 0) {
    return null;
  }

  const t = msgs("Files");

  type tType = Parameters<typeof t>[0];

  const typeToSnakeCase = type
    .replace(/([A-Z])/g, "_$1")
    .toLocaleLowerCase()
    .replace(/^_/g, "");

  const section_title = hyphenateString(t(`section_title_${typeToSnakeCase}` as tType));
  const toggle_target_id = `section_${typeToSnakeCase}`.replace(/[^0-9a-zA-Z]/g, "-");

  const attachedToDocuments = sortByAttachedTo
    ? files?.reduce(
        (acc, file) => {
          if (file.metadata.attachedTo?.length && file.metadata.attachedTo?.length > 0) {
            file.metadata.attachedTo.forEach(({ title, modelType }) => {
              if (modelType === type) {
                if (!acc[title]) {
                  acc[title] = [];
                }

                acc[title].push(file);
              }
            });
          }

          return acc;
        },
        {} as Record<string, FileData[]>
      )
    : undefined;

  return (
    <div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
      <SectionHeader title={section_title}>
        <RevalidatePaths />
        <CreateFile files_prefix={files_prefix} />
        <ToggleCollapsible
          tooltip
          target_id={toggle_target_id}
          text={[t("btnAll"), t("btnLess")]}
          type="section"
        />
      </SectionHeader>

      {/* Generate sub section - i.e. Projects/Certain project */}
      {attachedToDocuments && Object.keys(attachedToDocuments).length > 0 ? (
        Object.keys(attachedToDocuments)
          .sort()
          .map((attachedToDocument, index) => (
            <div
              key={attachedToDocument}
              className={`${styles.feed} scroll-mt-24 3xl:scroll-mt-8 mt-12 list-sub-section ${sortByAttachedToVisibleItems > index ? "" : "sub-section-collapsible"}`}
              id={`${toggle_target_id}_${index}`}
            >
              {/* This is the sub section title - i.e. Projects/Certain project */}
              <div className="flex flex-row w-full justify-between gap-4 items-center border-4 h-10 border-primary bg-primary rounded-full">
                <div className="text-xl font-semibold tracking-wide flex-grow pl-5 flex items-center rounded-full">
                  <h2 className="line-clamp-1">{attachedToDocument}</h2>
                </div>
                <ToggleCollapsible
                  tooltip
                  className="-mr-1"
                  target_id={`${toggle_target_id}_${index}`}
                  text={[t("btnAll"), t("btnLess")]}
                  type="section"
                />
              </div>

              {/* List the files in the sub section - i.e. Projects/Certain project - files... */}
              {attachedToDocuments[attachedToDocument]
                ?.sort((file_b, file_a) =>
                  /logo/.exec(file_a._id) ? 1 : file_a._id.localeCompare(file_b._id)
                )
                ?.map((file, index) => (
                  <FileCard
                    key={file._id}
                    className={visibleItems > index ? "" : "section-card-collapsible"}
                    file={file}
                    files_prefix={files_prefix}
                    section_id={`${toggle_target_id}_${type}_${attachedToDocument.replace(/ /g, "_")}`}
                  />
                ))}
            </div>
          ))
      ) : (
        // Generate a section without sub sections - i.e. "common" section
        <div className={styles.feed}>
          {files
            ?.sort((file_b, file_a) => file_a._id.localeCompare(file_b._id))
            ?.map((file, index) => (
              <FileCard
                key={file._id}
                className={visibleItems > index ? "" : "section-card-collapsible"}
                file={file}
                files_prefix={files_prefix}
                section_id={`${toggle_target_id}_${type}`}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Section;
