"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useSession, getProviders, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { Session } from "next-auth";

import { BuiltInProviderType } from "next-auth/providers/index";

import { UserObject } from "@/interfaces/User";
import { PageObject } from "@/interfaces/Page";
import { FileObject } from "@/interfaces/File";

type AuthProvidersType = Record<
	LiteralUnion<BuiltInProviderType, string>,
	ClientSafeProvider
> | null;

interface AppContextProps {
	users: UserObject[];
	setUsers: React.Dispatch<React.SetStateAction<UserObject[]>>;
	session: Session | null;
	authProviders: AuthProvidersType;
	pages: PageObject[];
	setPages: React.Dispatch<React.SetStateAction<PageObject[]>>;
	files: FileObject[];
	setFiles: React.Dispatch<React.SetStateAction<FileObject[]>>;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [authProviders, setAuthProviders] = useState<AuthProvidersType>(null);
	const [users, setUsers] = useState<UserObject[]>([]);
	const [pages, setPages] = useState<PageObject[]>([]);
	const [files, setFiles] = useState<FileObject[]>([]);

	const { data: session } = useSession();

	useEffect(() => {
		(async () => {
			setAuthProviders(await getProviders());
		})();
	}, []);

	return (
		<AppContext.Provider
			value={{
				pages,
				setPages,
				users,
				setUsers,
				authProviders,
				session,
				files,
				setFiles,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
