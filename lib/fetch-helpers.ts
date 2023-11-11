import slugify from "slugify";

import { PostType, PostTypeFromDb } from "@/interfaces/Post";

export async function fetchPosts(uri: string) {
	try {
		const response = await fetch(uri);

		if (!response.ok) {
			// throw new Error("Error in 'fetchPosts()'", (await response.json()).message);
			return null;
		}

		const data = await response.json();

		return data.hasOwnProperty("posts") ? data.posts : null;
	} catch (error) {
		// console.error(error);
		return null;
	}
}

export async function fetchSingleUser(userId: string | null) {
	try {
		if (!userId) {
			throw new Error("Error in 'fetchPosts()' 'userId' is null");
		}

		const response = await fetch(`/api/users/${userId}/data`);

		if (!response.ok) {
			// throw new Error("Error in 'fetchPosts()'", (await response.json()).message);
			return null;
		}

		const user = await response.json();

		return user.hasOwnProperty("_id") ? user : null;
	} catch (error) {
		// console.error(error);
		return null;
	}
}

export async function uploadOrReplaceImage({
	formDataToUpload,
	postImageFilename,
	post,
}: {
	formDataToUpload: FormData | undefined;
	postImageFilename: string | null;
	post: PostType | PostTypeFromDb;
}): Promise<string | null> {
	if (!postImageFilename || !formDataToUpload) {
		return (post as PostTypeFromDb)?.image?._id?.toString() ?? null;
	}

	let image_id: string | null = null;
	const old_image = (post as PostTypeFromDb)?.image;

	if (formDataToUpload) {
		const postImageFilenameToUpload = slugify(String(postImageFilename), {
			lower: true,
			remove: /[*+~()'"!:@]/g,
			locale: "en",
		});
		const fileToRename = formDataToUpload.get("fileToUpload") as File;

		formDataToUpload.set("fileToUpload", fileToRename, postImageFilenameToUpload);
		const response = await fetch("/api/files", {
			method: "POST",
			body: formDataToUpload,
		});

		if (response.ok) {
			image_id = (await response.json())[0]._id;

			const old_id = old_image?._id?.toString();

			if (image_id && old_id && image_id !== old_id) {
				const response = await fetch(`/api/files/${old_id}`, {
					method: "DELETE",
				});

				if (!response.ok) {
					console.error(response);
				}
			}
		}
	}

	return image_id ?? old_image._id?.toString() ?? null;
}
