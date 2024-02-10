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
import { getFiles } from "@/components/files/_files.actions";
import { getPageCards } from "@/components/pages/_pages.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileData } from "@/interfaces/File";
import { PageCardData } from "@/interfaces/PageCard";
import { TagData } from "@/interfaces/Tag";
import { AuthProviders } from "@/types/next-auth-providers";

interface AppContextProps {
	session: Session | null;
	authProviders: AuthProviders;
	aboutEntries: AboutEntryData[];
	setAboutEntries: Dispatch<SetStateAction<AboutEntryData[]>>;
	files: FileData[];
	setFiles: Dispatch<SetStateAction<FileData[]>>;
	pages: PageCardData[];
	setPages: Dispatch<SetStateAction<PageCardData[]>>;
	tags: TagData[];
	setTags: Dispatch<SetStateAction<TagData[]>>;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [authProviders, setAuthProviders] = useState<AuthProviders>(null);
	const [aboutEntries, setAboutEntries] = useState<AboutEntryData[]>([]);
	const [files, setFiles] = useState<FileData[]>([]);
	const [pages, setPages] = useState<PageCardData[]>([]);
	const [tags, setTags] = useState<TagData[]>([]);

	const { data: session } = useSession();

	useEffect(() => {
		(async () => {
			setAuthProviders(await getProviders());

			setAboutEntries((await getEntries({ hyphen: true, public: true })) ?? []);
			setFiles((await getFiles({ hyphen: true, public: true })) ?? []);
			setPages((await getPageCards({ hyphen: true, public: true })) ?? []);
			setTags((await getTags({ hyphen: true, public: true })) ?? []);
		})();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// useEffect(() => {
	// 	// eslint-disable-next-line no-console
	// 	console.log("FILES", files);
	// }, [files]);

	// useEffect(() => {
	// 	// eslint-disable-next-line no-console
	// 	console.log("PAGES", pages);
	// }, [pages]);

	// useEffect(() => {
	// 	// eslint-disable-next-line no-console
	// 	console.log("TAGS", tags);
	// }, [tags]);

	return (
		<AppContext.Provider
			value={{
				session,
				authProviders,
				aboutEntries,
				setAboutEntries,
				files,
				setFiles,
				pages,
				setPages,
				tags,
				setTags,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
