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

import { AuthProviders } from "@/types/next-auth-providers";

import { FileDocument } from "@/interfaces/File";
import { PageDoc } from "@/interfaces/Page";

interface AppContextProps {
	session: Session | null;
	pages: PageDoc[];
	setPages: Dispatch<SetStateAction<PageDoc[]>>;
	files: FileDocument[];
	setFiles: Dispatch<SetStateAction<FileDocument[]>>;
	authProviders: AuthProviders;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [pages, setPages] = useState<PageDoc[]>([]);
	const [files, setFiles] = useState<FileDocument[]>([]);
	const [authProviders, setAuthProviders] = useState<AuthProviders>(null);

	const { data: session } = useSession();

	useEffect(() => {
		if (!authProviders) {
			(async () => {
				setAuthProviders(await getProviders());
			})();
		}

		// loadDataFromApiRoute("PAGES", setPages);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	useEffect(() => {
		if (!session) {
			// setPages([]);
			setFiles([]);

			return;
		}

		// loadDataFromApiRoute("PAGES", setPages);
		loadDataFromApiRoute("FILES", setFiles);
	}, [session]);
	 */

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
