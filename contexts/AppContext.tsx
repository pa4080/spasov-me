"use client";

import { type Session } from "next-auth";
import { getProviders, useSession } from "next-auth/react";
import React, {
  type Dispatch,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAppData } from "@/components/_get.data.actions";
import { getFileList, getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileData, type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type LabEntryData } from "@/interfaces/LabEntry";
import { type PageCardData } from "@/interfaces/PageCard";
import { type PostData } from "@/interfaces/Post";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { type AuthProvidersType } from "@/types/next-auth-providers";

interface AppContextProps {
  session: Session | null;
  authProviders: AuthProvidersType;
  aboutEntries: AboutEntryData[];
  setAboutEntries: Dispatch<SetStateAction<AboutEntryData[]>>;
  posts: PostData[];
  setPosts: Dispatch<SetStateAction<PostData[]>>;
  labEntries: LabEntryData[];
  setLabEntries: Dispatch<SetStateAction<LabEntryData[]>>;
  iconsMap: IconsMap;
  setIconsMap: Dispatch<SetStateAction<IconsMap>>;
  files: FileData[];
  setFiles: Dispatch<SetStateAction<FileData[]>>;
  fileList: FileListItem[];
  setFileList: Dispatch<SetStateAction<FileListItem[]>>;
  pages: PageCardData[];
  setPages: Dispatch<SetStateAction<PageCardData[]>>;
  tags: TagData[];
  setTags: Dispatch<SetStateAction<TagData[]>>;
  projects: ProjectData[];
  setProjects: Dispatch<SetStateAction<ProjectData[]>>;
  searchDataReady: boolean;
  setFilesData: () => Promise<void>;
  setEntriesData: () => Promise<void>;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [authProviders, setAuthProviders] = useState<AuthProvidersType>(null);
  const [aboutEntries, setAboutEntries] = useState<AboutEntryData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [labEntries, setLabEntries] = useState<LabEntryData[]>([]);
  const [iconsMap, setIconsMap] = useState<IconsMap>({});
  const [files, setFiles] = useState<FileData[]>([]);
  const [fileList, setFileList] = useState<FileListItem[]>([]);
  const [pages, setPages] = useState<PageCardData[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchDataReady, setSearchDataReady] = useState(false);

  const { data: session } = useSession();

  const setFilesData = useCallback(async () => {
    const data = await Promise.all([
      getFilesR2({ hyphen: true, public: true }),
      getFileList(),
    ]).then(([files, fileList]) => ({
      files: files ?? [],
      fileList: fileList ?? [],
    }));

    setFiles(data.files);
    setFileList(data.fileList);
  }, []);

  const setEntriesData = useCallback(async () => {
    const data = await getAppData();

    setAboutEntries(data.aboutEntries);
    setPages(data.pages);
    setTags(data.tags);
    setProjects(data.projects);
    setPosts(data.posts);
    setLabEntries(data.labEntries);
    setIconsMap(data.iconsMap);
  }, []);

  useEffect(() => {
    void (async () => {
      setAuthProviders(await getProviders());
    })();

    // Fetch all app data on init via a single server action call
    void (async () => {
      try {
        const data = await getAppData();

        setAboutEntries(data.aboutEntries);
        setTags(data.tags);
        setProjects(data.projects);
        setPosts(data.posts);
        setLabEntries(data.labEntries);
        setIconsMap(data.iconsMap);
        setPages(data.pages);
        setSearchDataReady(true);
      } catch (error) {
        console.error("Failed to fetch app data:", error);
        setSearchDataReady(true);
      }
    })();

    return () => {};
  }, []);

  return (
    <AppContext.Provider
      value={{
        session,
        authProviders,
        aboutEntries,
        setAboutEntries,
        posts,
        setPosts,
        labEntries,
        setLabEntries,
        iconsMap,
        setIconsMap,
        files,
        setFiles,
        fileList,
        setFileList,
        pages,
        setPages,
        tags,
        setTags,
        projects,
        setProjects,
        searchDataReady,
        setFilesData,
        setEntriesData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
