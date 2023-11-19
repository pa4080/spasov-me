"use client";

import React, {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

import { getProviders, useSession } from "next-auth/react";
import { Session } from "next-auth";

import { AuthProviders } from "@/types/next-auth-providers";

import { PageObject } from "@/interfaces/Page";
import { FileObject } from "@/interfaces/File";

import loadDataFromApiRoute from "@/lib/load-data-fom-api-route";

interface AppContextProps {
	session: Session | null;
	pages: PageObject[];
	setPages: Dispatch<SetStateAction<PageObject[]>>;
	files: FileObject[];
	setFiles: Dispatch<SetStateAction<FileObject[]>>;
	authProviders: AuthProviders;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [pages, setPages] = useState<PageObject[]>([]);
	const [files, setFiles] = useState<FileObject[]>([]);
	const [authProviders, setAuthProviders] = useState<AuthProviders>(null);

	const { data: session } = useSession();

	useEffect(() => {
		if (!authProviders) {
			(async () => {
				setAuthProviders(await getProviders());
			})();
		}

		loadDataFromApiRoute("PAGES", setPages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!session) {
			// setPages([]);
			setFiles([]);

			return;
		}

		// loadDataFromApiRoute("PAGES", setPages);
		loadDataFromApiRoute("FILES", setFiles);
	}, [session]);

	return (
		<AppContext.Provider
			value={{
				pages,
				setPages,
				session,
				files,
				setFiles,
				authProviders,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
