import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { PostType } from "@/interfaces/_common-data-types";
import { NewPostData, PostData, PostDocPopulated } from "@/interfaces/Post";

import { processMarkdown } from "./md/process-markdown";
import { tagDocuments_toData } from "./process-data-tags";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

export async function postDocuments_toData({
	posts,
	hyphen,
	typeList,
	visible,
}: {
	posts: PostDocPopulated[];
	hyphen?: boolean;
	typeList?: PostType[];
	visible?: boolean;
}): Promise<PostData[]> {
	let postsFiltered = posts;

	if (visible) {
		postsFiltered = posts.filter((entry) => entry.visibility);
	}

	const files = await getFilesR2({ prefix: files_prefix });
	const icons = await getFilesR2({ prefix: icons_prefix });

	return postsFiltered
		.filter(({ entryType }) => (typeList && typeList.includes(entryType)) ?? true)
		.map((post) => ({
			_id: post._id.toString(),
			html: {
				// This cannot be done in the client side
				title: processMarkdown({
					markdown: post.title,
					hyphen,
				}),
				description: processMarkdown({
					markdown: post.description,
					hyphen,
				}),
				attachment: files?.find((file) => file?._id === post?.attachment),
				icon:
					files?.find((file) => file?._id === post?.icon) ||
					icons?.find((icon) => icon?._id === post?.icon),
			},
			title: post.title,
			description: post.description,
			slug: post.slug,
			url1: post.url1,
			url2: post.url2,
			dateFrom: post.dateFrom as Date,
			dateTo: post.dateTo as Date | undefined,
			entryType: post.entryType,
			galleryNav: post.galleryNav as boolean,
			galleryCaptions: post.galleryCaptions as boolean,
			visibility: post.visibility as boolean,
			icon: post.icon,
			attachment: post.attachment,
			tags: tagDocuments_toData({ tags: post.tags || [], hyphen: true }),
			gallery: files?.filter((file) => post?.gallery?.includes(file._id)),
			modelType: "Post",
		}));
}

export function postFormData_toNewPostData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewPostData {
	return {
		title: data.get("title") as string,
		description: data.get("description") as string,
		slug: data.get("slug") as string,
		url1: data.get("url1") as string,
		url2: data.get("url2") as string,
		entryType: data.get("entryType") as PostType,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		galleryNav: data.get("galleryNav") as string,
		galleryCaptions: data.get("galleryCaptions") as string,
		visibility: data.get("visibility") as string,
		attachment: data.get("attachment") as string,
		icon: data.get("icon") as string,

		tags: JSON.parse(data.get("tags") as string) as string[],
		gallery: JSON.parse(data.get("gallery") as string) as string[],

		creator: user_id,
	};
}
