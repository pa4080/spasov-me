import React from "react";

import { type FileData, type FileListItem } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";

import CopyFileAddressToClipboard from "./CopyFileAddressToClipboard";
import DisplayFileImage from "./DisplayFileImage";

interface Props {
  className?: string;
  fileList: FileListItem[];
  currentValue: string | undefined;
}

const DisplayEntryAttachmentInTheEditForm: React.FC<Props> = ({
  className,
  fileList,
  currentValue,
}) => {
  return (
    <CopyFileAddressToClipboard
      address={fileList?.find((f) => f.value === currentValue)?.sourceImage ?? "none"}
    >
      <DisplayFileImage
        className={cn(
          currentValue ? "opacity-90" : "opacity-25",
          "rounded-md object-cover w-10 h-10 min-w-10 border",
          className
        )}
        file={
          {
            filename:
              fileList?.find((f) => f.value === currentValue)?.label ??
              Route.assets.IMAGE_PLACEHOLDER,
            metadata: {
              html: {
                fileUri:
                  fileList?.find((f) => f.value === currentValue)?.sourceImage ??
                  Route.assets.IMAGE_PLACEHOLDER,
              },
            },
          } as FileData
        }
        sizes={["40px", "40px"]}
      />
    </CopyFileAddressToClipboard>
  );
};

export default DisplayEntryAttachmentInTheEditForm;
