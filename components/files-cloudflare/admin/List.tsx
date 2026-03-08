"use client";

import React, { useTransition } from "react";

import ContentFilterField from "@/components/shared/ContentFilterField";
import { type ModelType } from "@/interfaces/_common-data-types";
import { type FileData } from "@/interfaces/File";

import Section from "./Section";

interface Props {
  className?: string;
  files_prefix: string;
  visibleItemsCommon?: number;
  files: FileData[] | null;
}

const List_FilesAdmin_CloudFlare: React.FC<Props> = ({
  files_prefix,
  visibleItemsCommon = 3,
  files: allFiles,
}) => {
  const [files, setFiles] = React.useState<FileData[] | null>(allFiles);
  const interval = React.useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();

    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      startTransition(() => {
        if (value === "") {
          setFiles(allFiles);
        } else {
          const filteredFiles =
            allFiles?.filter(
              (file) =>
                file.filename.toLowerCase().includes(value) ||
                file.metadata.description?.toLowerCase().includes(value)
            ) || null;

          setFiles(filteredFiles);
        }

        if (interval.current) {
          clearInterval(interval.current);
        }
      });
    }, 300);
  };

  const sections = [
    {
      type: "common",
      visibleItems: visibleItemsCommon,
      sortByAttachedTo: false,
      files: files?.filter(
        (file) => !file.metadata.attachedTo || file.metadata.attachedTo.length === 0
      ),
    },
    {
      type: "AboutEntry",
      visibleItems: 2,
      sortByAttachedTo: true,
      files: files?.filter((file) =>
        file.metadata.attachedTo?.find(({ modelType }) => modelType === "AboutEntry")
      ),
    },
    {
      type: "Project",
      visibleItems: 1,
      sortByAttachedTo: true,
      files: files?.filter((file) =>
        file.metadata.attachedTo?.find(({ modelType }) => modelType === "Project")
      ),
    },
    {
      type: "LabEntry",
      visibleItems: 1,
      sortByAttachedTo: true,
      files: files?.filter((file) =>
        file.metadata.attachedTo?.find(({ modelType }) => modelType === "LabEntry")
      ),
    },
    {
      type: "Post",
      visibleItems: 2,
      sortByAttachedTo: true,
      files: files?.filter((file) =>
        file.metadata.attachedTo?.find(({ modelType }) => modelType === "Post")
      ),
    },
  ] satisfies {
    type: ModelType | "common";
    visibleItems: number;
    sortByAttachedTo: boolean;
    files: FileData[] | undefined;
  }[];

  return (
    <>
      <ContentFilterField handleFilterChange={handleFilterChange} isPending={isPending} />
      {sections.map(({ type, visibleItems, sortByAttachedTo, files }, index) => (
        <Section
          key={type}
          className={index === 0 ? "mt-4" : ""}
          files={files}
          files_prefix={files_prefix}
          scrollDisabled={index === 0}
          sortByAttachedTo={sortByAttachedTo}
          type={type as ModelType | "common"}
          visibleItems={visibleItems}
        />
      ))}
    </>
  );
};

export default List_FilesAdmin_CloudFlare;
