import FileCard from "@/components/fragments/files/Card";
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { type ModelType } from "@/interfaces/_common-data-types";
import { type FileData } from "@/interfaces/File";
import { hyphenateString } from "@/lib/process-text";
import { msgs } from "@/messages";

import CreateFile from "./Actions/CreateFile";

interface Props {
  className?: string;
  files: FileData[] | null | undefined;
  type?: ModelType | "common";
  visibleItems?: number;
  sortByAttachedTo?: boolean;
  sortByAttachedToVisibleItems?: number;
}

const Section: React.FC<Props> = ({
  className,
  files,
  type = "common",
  visibleItems = 2,
  sortByAttachedTo = true,
  sortByAttachedToVisibleItems = 2,
}) => {
  const t = msgs("Files");

  type tType = Parameters<typeof t>[0];

  const typeToSnakeCase = type
    .replace(/([A-Z])/g, "_$1")
    .toLocaleLowerCase()
    .replace(/^_/g, "");

  const section_title = hyphenateString(t(`section_title_${typeToSnakeCase}` as tType));
  const toggle_target_id = `section_${typeToSnakeCase}`;

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
    <div className={`files-section list-section ${className}`} id={toggle_target_id}>
      <SectionHeader title={section_title}>
        <RevalidatePaths />
        <CreateFile />
        <ToggleCollapsible
          tooltip
          target_id={toggle_target_id}
          text={[t("btnAll"), t("btnLess")]}
          type="section"
        />
      </SectionHeader>

      {attachedToDocuments && Object.keys(attachedToDocuments).length > 0 ? (
        Object.keys(attachedToDocuments).map((attachedToDocument, index) => (
          <div
            key={index}
            className={`files-feed scroll-mt-24 3xl:scroll-mt-8 mt-12 list-sub-section ${sortByAttachedToVisibleItems > index ? "" : "sub-section-collapsible"}`}
            id={`${toggle_target_id}_${index}`}
          >
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

            {attachedToDocuments[attachedToDocument]
              ?.sort((b, a) =>
                typeof a.uploadDate.getTime === "function" &&
                typeof b.uploadDate.getTime === "function"
                  ? a.uploadDate.getTime() - b.uploadDate.getTime()
                  : 0
              )
              ?.map((file, index) => (
                <FileCard
                  key={file._id.toString()}
                  className={visibleItems > index ? "" : "section-card-collapsible"}
                  file={file}
                  files_prefix={"mongodb"}
                  section_id={`${toggle_target_id}_${type}_${attachedToDocument.replace(/ /g, "_")}`}
                />
              ))}
          </div>
        ))
      ) : (
        <div className="files-feed">
          {files
            ?.sort((b, a) =>
              typeof a.uploadDate.getTime === "function" &&
              typeof b.uploadDate.getTime === "function"
                ? a.uploadDate.getTime() - b.uploadDate.getTime()
                : 0
            )
            ?.map((file, index) => (
              <FileCard
                key={file._id.toString()}
                className={visibleItems > index ? "" : "section-card-collapsible"}
                file={file}
                files_prefix={"mongodb"}
                section_id={`${toggle_target_id}_${type}`}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Section;
