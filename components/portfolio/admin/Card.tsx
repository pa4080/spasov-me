import { format } from "date-fns";
import { enUS as en } from "date-fns/locale";
import Link from "next/link";
import React from "react";

import DisplayFileImage from "@/components/shared/DisplayFileImage";
import DisplayIcon from "@/components/shared/DisplayIcon";
import DisplayResourceUrlAsIcon from "@/components/shared/DisplayResourceUrlAsIcon";
import FileAddressHandle from "@/components/shared/FileAddressHandle";
import Gallery from "@/components/shared/Gallery";
import ToggleCollapsible from "@/components/shared/ToggleCollapsible";
import VisibilitySwitchDisplay from "@/components/shared/VisibilitySwitchDisplay";
import { type FileData, type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";
import styles from "app/_styles/card-info.module.css";

import DeleteProject from "./Actions/Delete";
import UpdateProject from "./Actions/Update";

interface Props {
  className?: string;
  project: ProjectData;
  displayTagsInline?: boolean;
  displayGalleryInline?: boolean;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const ProjectAdminCard: React.FC<Props> = ({
  project,
  className,
  displayTagsInline = true,
  displayGalleryInline = true,
  fileList,
  iconList,
  iconsMap,
  tags,
}) => {
  const tTime = msgs("Projects_Form");
  const tCommon = msgs("Projects");
  const tCard = msgs("Projects_CardPublic");

  const { dateFrom, dateTo } = project;
  const dtFrom = new Date(dateFrom);
  const dtTo = dateTo ? new Date(dateTo) : undefined;
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`entry_${project?._id.toString()}`);
  const descriptionArr = project.html.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  let gallery = project?.gallery
    ?.map((file) => file.metadata.html)
    ?.sort((a, b) => a.filename.localeCompare(b.filename));

  gallery =
    project?.html?.attachment && gallery
      ? [project?.html?.attachment.metadata.html].concat(gallery)
      : gallery;

  // This is disabled because the "icon" usually is SVG with a transparent background
  // and looks ugly within the container which have the site logo oas background
  // gallery =
  // 	project?.html?.icon && gallery ? [project?.html?.icon.metadata.html].concat(gallery) : gallery;

  return (
    <div className={`card-border-wrapper ${className}`} id={toggle_target_id}>
      <div className={styles.card}>
        <div className={styles.info}>
          <div className={styles.date}>
            <span>
              {/* <span className={styles.lightSecondaryText}>
							{format(dtFrom, "MM/", { locale: en })}
						</span> */}
              <span className={styles.lightPrimaryText}>
                {format(dtFrom, "yyyy", { locale: en })}
              </span>
            </span>
            <span className={styles.lightPrimaryText}>{" - "}</span>
            {dtTo ? (
              <span>
                {/* <span className={styles.lightSecondaryText}>
								{format(dtTo, "MM/", { locale: en })}
							</span> */}
                <span className={styles.lightPrimaryText}>
                  {format(dtTo, "yyyy", { locale: en })}
                </span>
              </span>
            ) : (
              <span className={styles.lightPrimaryText}>{tTime("dateTo_now_current")}</span>
            )}
          </div>

          {project.slug && (
            <div className={`${styles.slug} ${styles.lightSecondaryText}`}>
              <Link href={`${Route.public.PORTFOLIO.uri}/${project.slug}`}>/{project.slug}</Link>
            </div>
          )}

          <div className={`${styles.linksProjectPost} scale-90 origin-left`}>
            <div className={styles.iconWrapper}>
              <DisplayResourceUrlAsIcon
                iconType="globe-pointer"
                isClickable={!!project.urlHome}
                label={tCard("tooltip_link", { linkType: "Home Page" })}
                url={project.urlHome}
              />
            </div>
            <div className={styles.iconWrapper}>
              <DisplayResourceUrlAsIcon
                className="-ml-1 -mr-0.5"
                iconType="user-shield"
                isClickable={!!project.urlAdmin}
                label={tCard("tooltip_link", { linkType: "Admin Page" })}
                url={project.urlAdmin}
                width={34}
              />
            </div>
            <div className={styles.iconWrapper}>
              <DisplayResourceUrlAsIcon
                iconType="box-circle-check"
                isClickable={!!project.urlRepo}
                label={tCard("tooltip_link", { linkType: "Repository" })}
                url={project.urlRepo}
                width={30}
              />
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <div className={styles.buttonsContainer}>
              <Gallery
                className="mt-0.5"
                entry={project}
                gallery={gallery}
                height={24}
                width={24}
              />
              <FileAddressHandle
                address={
                  project.html.attachment?.metadata?.html?.fileUri ??
                  project.html.attachment?.metadata?.html?.fileUrl ??
                  ""
                }
              />
              <DeleteProject project={project} />
              <VisibilitySwitchDisplay disabled checked={project.visibility} className="mt-0.5" />
              <UpdateProject
                fileList={fileList}
                iconList={iconList}
                iconsMap={iconsMap}
                project={project}
                tags={tags}
              />

              <ToggleCollapsible
                tooltip
                className="icon_accent_primary"
                target_id={toggle_target_id}
                text={[tCommon("btnMore"), tCommon("btnLess")]}
                type={descriptionArr[1] ? "card" : "card-item-single"}
              />
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: project.html.title }} className={styles.title} />
        </div>
        <div className={`${styles.description} md-processed-to-html`}>
          <div className="prose max-w-none">
            {descriptionArr.map((description, index, arr) => (
              <div
                dangerouslySetInnerHTML={{ __html: description }}
                key={index}
                className={
                  index === 0
                    ? arr.length > 1
                      ? "card-item-static font-semibold admin-projects-card"
                      : "card-item-single font-semibold"
                    : "card-item-collapsible"
                }
              />
            ))}
          </div>

          {displayTagsInline && (
            <div className="card-item-collapsible--disabled mt-4">
              <div className="about-entry-tags">
                {project.tags
                  ?.sort((a, b) =>
                    a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
                  )
                  .map((tag) => (
                    <DisplayIcon
                      key={tag._id}
                      description={tag.html.description}
                      icon={iconsMap[tag.icon]}
                    />
                  ))}
              </div>
            </div>
          )}

          {displayGalleryInline && gallery && gallery.length > 0 && (
            <div className="card-item-collapsible--disabled">
              <div className="flex gap-2 flex-wrap p-0 mt-4">
                {[project?.html?.icon?.metadata?.html, ...gallery].map((image, index) => (
                  <DisplayFileImage
                    key={index}
                    className={`w-8 h-8 rounded-sm`}
                    description={image?.filename}
                    file={
                      {
                        filename: image?.filename,
                        metadata: {
                          html: {
                            fileUri: image?.fileUri ?? image?.fileUrl,
                          },
                        },
                      } as FileData
                    }
                    sizes={["32px", "32px"]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectAdminCard;
