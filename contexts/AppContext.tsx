"use client";

import React, {
	Dispatch,
	SetStateAction,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import { Session } from "next-auth";
import { getProviders, useSession } from "next-auth/react";

import { getEntries } from "@/components/about/_about.actions";
import { getFileList, getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { getPageCards } from "@/components/pages/_pages.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileData, FileListItem } from "@/interfaces/File";
import { PageCardData } from "@/interfaces/PageCard";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { AuthProviders } from "@/types/next-auth-providers";

interface AppContextProps {
	session: Session | null;
	authProviders: AuthProviders;
	setAboutEntries: Dispatch<SetStateAction<AboutEntryData[] | null>>;
	aboutEntries: AboutEntryData[] | null;
	files: FileData[] | null;
	setFiles: Dispatch<SetStateAction<FileData[] | null>>;
	fileList: FileListItem[] | null;
	setFileList: Dispatch<SetStateAction<FileListItem[] | null>>;
	pages: PageCardData[] | null;
	setPages: Dispatch<SetStateAction<PageCardData[] | null>>;
	tags: TagData[] | null;
	setTags: Dispatch<SetStateAction<TagData[] | null>>;
	projects: ProjectData[] | null;
	setProjects: Dispatch<SetStateAction<ProjectData[] | null>>;
	setFilesData: () => Promise<void>;
	setEntriesData: () => Promise<void>;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [authProviders, setAuthProviders] = useState<AuthProviders>(null);
	const [aboutEntries, setAboutEntries] = useState<AboutEntryData[] | null>(null);
	const [files, setFiles] = useState<FileData[] | null>(null);
	const [fileList, setFileList] = useState<FileListItem[] | null>(null);
	const [pages, setPages] = useState<PageCardData[] | null>(null);
	const [tags, setTags] = useState<TagData[] | null>(null);
	const [projects, setProjects] = useState<ProjectData[] | null>(null);

	const { data: session } = useSession();

	const setFilesData = useCallback(async () => {
		setFiles(await getFilesR2({ hyphen: true, public: true }));
		setFileList(await getFileList());
	}, []);

	const setEntriesData = useCallback(async () => {
		setAboutEntries(await getEntries({ hyphen: true, public: true }));
		setPages(await getPageCards({ hyphen: true, public: true }));
		setTags(await getTags({ hyphen: true, public: true }));
		setProjects(await getProjects({ hyphen: true, public: true }));
	}, []);

	useEffect(() => {
		(async () => {
			setAuthProviders(await getProviders());

			setFiles(await getFilesR2({ hyphen: true, public: true }));
			setFileList(await getFileList());
			setAboutEntries(await getEntries({ hyphen: true, public: true }));
			setPages(await getPageCards({ hyphen: true, public: true }));
			setTags(await getTags({ hyphen: true, public: true }));
			setProjects(await getProjects({ hyphen: true, public: true }));
		})();
	}, []);

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
