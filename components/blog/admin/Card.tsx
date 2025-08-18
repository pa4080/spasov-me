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
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";
import styles from "app/_styles/card-info.module.css";

import DeletePost from "./Actions/Delete";
import UpdatePost from "./Actions/Update";

interface Props {
  className?: string;
  post: PostData;
  displayTagsInline?: boolean;
  displayGalleryInline?: boolean;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const PostAdminCard: React.FC<Props> = ({
  post,
  className,
  displayTagsInline = true,
  displayGalleryInline = true,
  fileList,
  iconList,
  iconsMap,
  tags,
}) => {
  // const tTime = msgs("Posts_Form");
  const tCommon = msgs("Posts");
  const tCard = msgs("Posts_CardPublic");

  const { dateFrom, dateTo } = post;
  const dtFrom = new Date(dateFrom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dtTo = dateTo ? new Date(dateTo) : undefined;
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`entry_${post?._id.toString()}`);
  const descriptionArr = post.html.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  let gallery = post?.gallery
    ?.map((file) => file.metadata.html)
    ?.sort((a, b) => a.filename.localeCompare(b.filename));

  gallery =
    post?.html?.attachment && gallery
      ? [post?.html?.attachment.metadata.html].concat(gallery)
      : gallery;

  // This is disabled because the "icon" usually is SVG with a transparent background
  // and looks ugly within the container which have the site logo oas background
  // gallery =
  // 	post?.html?.icon && gallery ? [post?.html?.icon.metadata.html].concat(gallery) : gallery;

  const isDisabled_Url1 =
    post.url1 === undefined || post.url1 === null || post.url1 === "" || post.url1 === "undefined";

  const isDisabled_Url2 =
    post.url2 === undefined || post.url2 === null || post.url2 === "" || post.url2 === "undefined";

  return (
    <div className={`card-border-wrapper ${className}`} id={toggle_target_id}>
      <div className={styles.card}>
        <div className={styles.info}>
          <div className={styles.date}>
            <span>
              <span className={styles.lightPrimaryText}>
                {format(dtFrom, "dd.MM.yyyy", { locale: en })}
              </span>
            </span>
          </div>

          {post.slug && (
            <div className={`${styles.slug} ${styles.lightSecondaryText}`}>
              <Link href={`${Route.public.BLOG.uri}/${post.slug}`}>/{post.slug}</Link>
            </div>
          )}

          <div className={`${styles.linksProjectPost} scale-90 origin-left`}>
            <div className={styles.iconWrapper}>
              <DisplayResourceUrlAsIcon
                className="grayscale-[100%] hover:grayscale-[0%]"
                height={21}
                iconType="arrow-up-right-from-square"
                icon_className_Path1="fill-accent-secondary"
                icon_className_Path2="fill-accent"
                isDisabled={isDisabled_Url1}
                label={tCard("tooltip_link", { linkType: "Link 1" })}
                url={post.url1}
                width={21}
              />
            </div>
            <div className={styles.iconWrapper}>
              <DisplayResourceUrlAsIcon
                className="grayscale-[100%] hover:grayscale-[0%]"
                height={21}
                iconType="arrow-up-right-from-square"
                icon_className_Path1="fill-accent-secondary"
                icon_className_Path2="fill-accent"
                isDisabled={isDisabled_Url2}
                label={tCard("tooltip_link", { linkType: "Link 2" })}
                url={post.url2}
                width={21}
              />
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <div className={styles.buttonsContainer}>
              <Gallery className="mt-0.5" entry={post} gallery={gallery} height={24} width={24} />
              <FileAddressHandle
                address={
                  post.html.attachment?.metadata?.html?.fileUri ??
                  post.html.attachment?.metadata?.html?.fileUrl ??
                  ""
                }
              />
              <DeletePost post={post} />
              <VisibilitySwitchDisplay disabled checked={post.visibility} className="mt-1" />
              <UpdatePost
                fileList={fileList}
                iconList={iconList}
                iconsMap={iconsMap}
                post={post}
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
          <div
            dangerouslySetInnerHTML={{ __html: post?.html?.title || "" }}
            className={styles.title}
          />
        </div>
        <div className={`${styles.description} md-processed-to-html`}>
          <div className="prose max-w-none">
            {descriptionArr.map((description, index, arr) => (
              <div
                dangerouslySetInnerHTML={{ __html: description || "" }}
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
                {post.tags
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
                {[post?.html?.icon?.metadata?.html, ...gallery].map((image, index) => (
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

export default PostAdminCard;
