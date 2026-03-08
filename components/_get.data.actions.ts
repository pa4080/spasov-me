"use server";

import { getEntries } from "@/components/about/_about.actions";
import { getPosts } from "@/components/blog/_blog.actions";
import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getLabEntries } from "@/components/laboratory/_lab.actions";
import { getPageCards } from "@/components/pages/_pages.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type LabEntryData } from "@/interfaces/LabEntry";
import { type PageCardData } from "@/interfaces/PageCard";
import { type PostData } from "@/interfaces/Post";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { splitDescriptionKeyword } from "@/lib/md/process-markdown";
import {
  files_prefix,
  icons_prefix,
  redis,
  redis_cache_app_data_key,
  redis_ttl,
} from "@/lib/redis";

type AppDataEntry = { dateFrom: Date | string; dateTo?: Date | string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppData = Record<string, any>;

const reconstituteDates = <T extends AppDataEntry>(items: T[]): T[] =>
  items.map((item) => ({
    ...item,
    dateFrom: new Date(item.dateFrom),
    dateTo: item.dateTo ? new Date(item.dateTo) : undefined,
  })) as T[];

/**
 * Fetch all public data needed by the application at startup.
 * A single server action call = one HTTP round-trip from the client.
 * Results are cached in Redis and invalidated on any data mutation.
 */
export const getAppData = async () => {
  try {
    const cached = await redis.get<AppData>(redis_cache_app_data_key);

    if (cached) {
      return {
        aboutEntries: reconstituteDates((cached.aboutEntries ?? []) as AboutEntryData[]),
        tags: (cached.tags ?? []) as TagData[],
        projects: reconstituteDates((cached.projects ?? []) as ProjectData[]),
        posts: reconstituteDates((cached.posts ?? []) as PostData[]),
        labEntries: reconstituteDates((cached.labEntries ?? []) as LabEntryData[]),
        iconsMap: (cached.iconsMap ?? {}) as IconsMap,
        pages: (cached.pages ?? []) as PageCardData[],
        fileList: (cached.fileList ?? []) as FileListItem[],
        iconList: (cached.iconList ?? []) as FileListItem[],
      };
    }
  } catch {
    // Cache read failed — fall through to fetch fresh data
  }

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

  const appData = {
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

  void redis.set(redis_cache_app_data_key, JSON.stringify(appData), { ex: redis_ttl });

  return appData;
};
