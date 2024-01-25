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
import loadDataFromApiRoute from "@/lib/load-data-fom-api-route";

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

		const controller = new AbortController();

		(async () => {
			await loadDataFromApiRoute("PAGES", setPages, controller);
			await loadDataFromApiRoute("FILES", setFiles, controller);
		})();

		return () => {
			controller.abort();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
