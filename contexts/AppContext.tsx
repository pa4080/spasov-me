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

import { getEntries } from "@/components/about/_about.actions";
import { getFileList, getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { getPageCards } from "@/components/pages/_pages.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileData, type FileListItem } from "@/interfaces/File";
import { type PageCardData } from "@/interfaces/PageCard";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { type AuthProviders } from "@/types/next-auth-providers";

interface AppContextProps {
  session: Session | null;
  authProviders: AuthProviders;
  aboutEntries: AboutEntryData[];
  setAboutEntries: Dispatch<SetStateAction<AboutEntryData[]>>;
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
  setFilesData: () => Promise<void>;
  setEntriesData: () => Promise<void>;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [authProviders, setAuthProviders] = useState<AuthProviders>(null);
  const [aboutEntries, setAboutEntries] = useState<AboutEntryData[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [fileList, setFileList] = useState<FileListItem[]>([]);
  const [pages, setPages] = useState<PageCardData[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

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
    const data = await Promise.all([
      getEntries({ hyphen: true, public: true }),
      getPageCards({ hyphen: true, public: true }),
      getTags({ hyphen: true, public: true }),
      getProjects({ hyphen: true, public: true }),
    ]).then(([aboutEntries, pages, tags, projects]) => ({
      aboutEntries: aboutEntries ?? [],
      pages: pages ?? [],
      tags: tags ?? [],
      projects: projects ?? [],
    }));

    setAboutEntries(data.aboutEntries);
    setPages(data.pages);
    setTags(data.tags);
    setProjects(data.projects);
  }, []);

  useEffect(() => {
    void (async () => {
      setAuthProviders(await getProviders());
    })();

    // if (session) {
    // 	setFilesData();
    // 	setEntriesData();
    // }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  // useEffect(() => {
  // 	if (session) {
  // 		setFilesData();
  // 		setEntriesData();
  // 	}
  // }, [session]);

  return (
    <AppContext.Provider
      value={{
        session,
        authProviders,
        aboutEntries,
        setAboutEntries,
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
        setFilesData,
        setEntriesData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
