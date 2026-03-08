"use server";

import { getEntries } from "@/components/about/_about.actions";
import { getPosts } from "@/components/blog/_blog.actions";
import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getLabEntries } from "@/components/laboratory/_lab.actions";
import { getPageCards } from "@/components/pages/_pages.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { splitDescriptionKeyword } from "@/lib/md/process-markdown";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

/**
 * Fetch all public data needed by the application at startup.
 * A single server action call = one HTTP round-trip from the client.
 */
export const getAppData = async () => {
  const [aboutEntries, tags, projects, posts, labEntries, iconsMap, pages, fileList, iconList] =
    await Promise.all([
      getEntries({ hyphen: true, public: true }),
      getTags({ hyphen: true, public: true }),
      getProjects({ hyphen: true, public: true }),
      getPosts({ hyphen: true, public: true }),
      getLabEntries({ hyphen: true, public: true }),
      getIconsMap(),
      getPageCards({ hyphen: true, public: true }),
      getFileList({ prefix: files_prefix }),
      getFileList({ prefix: icons_prefix }),
    ]);

  return {
    aboutEntries: aboutEntries ?? [],
    tags: tags ?? [],
    projects: projects ?? [],
    posts: posts ?? [],
    labEntries:
      labEntries?.map((entry) => ({
        ...entry,
        html: {
          ...entry.html,
          description: entry.html.description.split(splitDescriptionKeyword)[0],
        },
        description: entry.description.split(splitDescriptionKeyword)[0],
      })) ?? [],
    iconsMap,
    pages: pages ?? [],
    fileList: fileList ?? [],
    iconList: iconList ?? [],
  };
};
