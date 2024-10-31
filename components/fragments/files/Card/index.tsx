import { format } from "date-fns";
import { enUS as en } from "date-fns/locale";
import React from "react";

import DeleteFile_Cloudflare from "@/components/files-cloudflare/admin/Actions/DeleteFile";
import UpdateFile_Cloudflare from "@/components/files-cloudflare/admin/Actions/UpdateFile";
import DeleteFile_MongoDb from "@/components/files-mongodb/admin/Actions/DeleteFile";
import UpdateFile_MongoDb from "@/components/files-mongodb/admin/Actions/UpdateFile";
import AttachedToBadge from "@/components/fragments/AttachedToBadge";
import CopyFileAddressToClipboard from "@/components/fragments/CopyFileAddressToClipboard";
import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import FileAddressHandle from "@/components/fragments/FileAddressHandle";
import Gallery from "@/components/fragments/Gallery";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";
import { type FileData } from "@/interfaces/File";
import { capitalize } from "@/lib/capitalize";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { roundTo } from "@/lib/round";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

interface Props {
  className?: string;
  file: FileData;
  section_id?: string;
  files_prefix: string; // "mongodb" is a special one, the rest are related for Cloudflare R2's "folders" structure
}

const FileCard: React.FC<Props> = ({ className, file, section_id = "common", files_prefix }) => {
  const tCommon = msgs("Files");
  const t = msgs("Files_Display");

  const toggle_target_id = sanitizeHtmlTagIdOrClassName(
    `file_${file?._id}_${section_id}`.replace(/[^0-9a-zA-Z]/g, "-")
  );

  const descriptionArr = file.metadata.html.description
    .split(splitDescriptionKeyword)
    .map((str) => {
      return str.replace(commentsMatcher, "");
    });

  const fileAddress = file.metadata.html.fileUri ?? file.metadata.html.fileUrl ?? "";

  const isInMongoDB = files_prefix === "mongodb";

  return (
    <div className={`file-card card-border-wrapper ${className}`} id={toggle_target_id}>
      <div className="file-card-grid">
        <div className="file-image-container">
          <DisplayFileImage
            className="file-image-thumb h-[80px] w-[80px] object-cover rounded-md -z-[1]"
            file={file}
          />
          <DisplayFileImage
            className="file-image-large card-item-collapsible h-auto w-[100%] sm:w-[320px] object-contain rounded-md my-2 sm:my-0 animate-zoomInFile origin-top-left z-[1]"
            file={file}
          />
        </div>

        <div className="file-row-1-header">
          <div className="file-actions">
            <div className="file-actions-grid">
              <Gallery
                entry={{ title: file.filename }}
                gallery={[file.metadata.html]}
                height={24}
                width={24}
              />
              <FileAddressHandle download address={fileAddress} />
              <CopyFileAddressToClipboard address={fileAddress} className="mt-0.5" />
              <FileAddressHandle address={fileAddress} />

              {isInMongoDB ? (
                <DeleteFile_MongoDb file={file} />
              ) : (
                <DeleteFile_Cloudflare file={file} files_prefix={files_prefix} />
              )}
              <VisibilitySwitchDisplay disabled checked={file.metadata.visibility} />
              {isInMongoDB ? (
                <UpdateFile_MongoDb file={file} />
              ) : (
                <UpdateFile_Cloudflare file={file} files_prefix={files_prefix} />
              )}

              <ToggleCollapsible
                tooltip
                className="icon_accent_primary"
                target_id={toggle_target_id}
                text={[tCommon("btnAll"), tCommon("btnLess")]}
                type={"card"}
              />
            </div>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: file.metadata.html.title }}
            className="file-name"
          />
        </div>

        <div className="file-row-2-info">
          <div className="size">
            <span className="light-primary-text">
              {roundTo(Number(file.metadata.size) / 1024, 0).toLocaleString("en-US")}
            </span>
            <span className="light-secondary-text">{t("kilobyte")}</span>
          </div>

          <div className="date-modified">
            <span className="light-primary-text">
              {format(file.metadata.lastModified, "MMM. d, yyyy", { locale: en })}
            </span>
          </div>

          <div className="content-type">
            <span className="light-primary-text">{file.metadata.contentType}</span>
          </div>
        </div>

        <div className={"file-row-3-content card-item-collapsible"}>
          <div className="content">
            <div className={"description md-processed-to-html"}>
              {descriptionArr.map((description, index) => {
                return <div dangerouslySetInnerHTML={{ __html: description }} key={index} />;
              })}
            </div>
            {file.metadata.attachedTo && file.metadata.attachedTo.length > 0 && (
              <div className="attached-to">
                {file.metadata.attachedTo.map((item, index) => (
                  <AttachedToBadge
                    key={index}
                    badgeLabel={item.title}
                    ttContentLn1={`${capitalize(item.modelType)}: ${item.title}`}
                    ttContentLn2={t("index_id", { index, id: item._id })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
