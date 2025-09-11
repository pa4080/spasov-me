import { getPostList_SiteMap } from "@/components/blog/_blog.actions";
import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { getProjectList_SiteMap } from "@/components/portfolio/_portfolio.actions";

import type { MetadataRoute } from "next";

export const revalidate = 604800; // invalidate every week

const files_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES ?? "files";
const BASE_URL = "https://www.spasov.me";
const BASE_URL_IMAGES = "https://media.spasov.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const files = await getFilesR2({ prefix: files_prefix });

  const projectListAwaited = getProjectList_SiteMap();
  const postListAwaited = getPostList_SiteMap();
  const [projectList, postList] = await Promise.all([projectListAwaited, postListAwaited]);

  const projectsMap: MetadataRoute.Sitemap =
    projectList?.map((project) => {
      const attachmentImage = files?.find((file) => file?._id === project?.attachment)?.objectKey;
      const galleryImages = files
        ?.filter((file) => project?.gallery?.includes(file._id))
        .map((file) => file.objectKey);

      const images: string[] = [attachmentImage, ...(galleryImages ?? [])]
        .filter((item) => item !== undefined)
        .map((item) => `${BASE_URL_IMAGES}/${item}`);

      return {
        url: `${BASE_URL}/portfolio/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        images,
      };
    }) ?? [];

  const postsMap: MetadataRoute.Sitemap =
    postList?.map((post) => {
      const attachmentImage = files?.find((file) => file?._id === post?.attachment)?.objectKey;
      const galleryImages = files
        ?.filter((file) => post?.gallery?.includes(file._id))
        .map((file) => file.objectKey);

      const images: string[] = [attachmentImage, ...(galleryImages ?? [])]
        .filter((item) => item !== undefined)
        .map((item) => `${BASE_URL_IMAGES}/${item}`);

      return {
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
        images,
      };
    }) ?? [];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...projectsMap,
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...postsMap,
  ];
}
