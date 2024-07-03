import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import Link from "next/link";

import styles from "@/app/(styles)/card-info.module.scss";
import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import DisplayIcon from "@/components/fragments/DisplayIcon";
import FileAddressHandle from "@/components/fragments/FileAddressHandle";
import Gallery from "@/components/fragments/Gallery";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";
import { FileData, FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";
import { Route } from "@/routes";
import DisplayResourceUrlAsIcon from "../common/DisplayResourceUrlAsIcon";
import DeletePost from "./Actions/Delete";
import UpdatePost from "./Actions/Update";

interface Props {
	className?: string;
	post: PostData;
	displayTagsInline?: boolean;
	displayGalleryInline?: boolean;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	tags: TagData[] | null;
}

const PostAdminCard: React.FC<Props> = ({
	post,
	className,
	displayTagsInline = true,
	displayGalleryInline = true,
	fileList,
	iconList,
	tags,
}) => {
	const tTime = msgs("Posts_Form");
	const tCommon = msgs("Posts");

	const { dateFrom, dateTo } = post;
	const dtFrom = new Date(dateFrom);
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

					<div className={styles.linksProjectPost}>
						<div className={styles.iconWrapper}>
							<DisplayResourceUrlAsIcon size={23} type="URL 1" url={post.url1} />
						</div>
						<div className={styles.iconWrapper}>
							<DisplayResourceUrlAsIcon size={28} type="URL 2" url={post.url2} />
						</div>
					</div>
				</div>
				<div className={styles.header}>
					<div className={styles.buttons}>
						<div className={styles.buttonsContainer}>
							<DeletePost post={post} />
							<VisibilitySwitchDisplay disabled checked={post.visibility} className="mt-0.5" />
							<FileAddressHandle
								address={
									post.html.attachment?.metadata?.html?.fileUri ||
									post.html.attachment?.metadata?.html?.fileUrl ||
									""
								}
							/>
							<Gallery entry={post} gallery={gallery} />
							<UpdatePost post={post} fileList={fileList} iconList={iconList} tags={tags} />

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
											icon={iconsMap[tag.icon as IconsMapItem]}
										/>
									))}
							</div>
						</div>
					)}

					{displayGalleryInline && gallery && gallery.length > 0 && (
						<div className="card-item-collapsible--disabled">
							<div className="flex gap-2 flex-wrap p-0 mt-4">
								{[post?.html?.icon && post?.html?.icon?.metadata?.html, ...gallery].map(
									(image, index) => (
										<DisplayFileImage
											key={index}
											className={`w-8 h-8 rounded-sm`}
											description={image?.filename}
											file={
												{
													filename: image?.filename,
													metadata: {
														html: {
															fileUri: image?.fileUri || image?.fileUrl,
														},
													},
												} as FileData
											}
											sizes={["32px", "32px"]}
										/>
									)
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PostAdminCard;
