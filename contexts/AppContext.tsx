"use client";

import React, {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import { Session } from "next-auth";
import { getProviders, useSession } from "next-auth/react";

import { getEntries } from "@/components/about/_about.actions";
import { getFileList, getFiles } from "@/components/files-mongodb/_files.actions"; // TODO: files-cloudflare tidy up
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

	useEffect(() => {
		(async () => {
			setAuthProviders(await getProviders());

			setAboutEntries((await getEntries({ hyphen: true, public: true })) ?? []);
			setFiles((await getFiles({ hyphen: true, public: true })) ?? []);
			setFileList((await getFileList()) ?? []);
			setPages((await getPageCards({ hyphen: true, public: true })) ?? []);
			setTags((await getTags({ hyphen: true, public: true })) ?? []);
			setProjects((await getProjects({ hyphen: true, public: true })) ?? []);
		})();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
