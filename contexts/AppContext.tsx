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
  useMemo,
  useState,
} from "react";

import { getAppData } from "@/components/_get.data.actions";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
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
  fileList: FileListItem[];
  setFileList: Dispatch<SetStateAction<FileListItem[]>>;
  iconList: FileListItem[];
  setIconList: Dispatch<SetStateAction<FileListItem[]>>;
  pages: PageCardData[];
  setPages: Dispatch<SetStateAction<PageCardData[]>>;
  tags: TagData[];
  setTags: Dispatch<SetStateAction<TagData[]>>;
  techTags: TagData[];
  projects: ProjectData[];
  setProjects: Dispatch<SetStateAction<ProjectData[]>>;
  searchDataReady: boolean;
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
  const [fileList, setFileList] = useState<FileListItem[]>([]);
  const [iconList, setIconList] = useState<FileListItem[]>([]);
  const [pages, setPages] = useState<PageCardData[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [searchDataReady, setSearchDataReady] = useState(false);

  const techTags = useMemo(() => tags.filter((t) => t.tagType !== "system"), [tags]);

  const { data: session } = useSession();

  const setEntriesData = useCallback(async () => {
    const data = await getAppData();

    setAboutEntries(data.aboutEntries);
    setTags(data.tags);
    setProjects(data.projects);
    setPosts(data.posts);
    setLabEntries(data.labEntries);
    setIconsMap(data.iconsMap);
    setPages(data.pages);
    setFileList(data.fileList);
    setIconList(data.iconList);
    setSearchDataReady(true);
  }, []);

  useEffect(() => {
    void (async () => {
      setAuthProviders(await getProviders());
    })();
  }, [setEntriesData]);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void setEntriesData();
    } catch (error) {
      console.error("Failed to fetch app data:", error);
      setSearchDataReady(true);
    }
  }, [setEntriesData]);

  useEffect(() => {
    const handleMutationSuccess = () => {
      void setEntriesData();
    };

    document.addEventListener("app:mutation-success", handleMutationSuccess);

    return () => {
      document.removeEventListener("app:mutation-success", handleMutationSuccess);
    };
  }, [setEntriesData]);

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
        fileList,
        setFileList,
        iconList,
        setIconList,
        pages,
        setPages,
        tags,
        setTags,
        techTags,
        projects,
        setProjects,
        searchDataReady,
        setEntriesData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
