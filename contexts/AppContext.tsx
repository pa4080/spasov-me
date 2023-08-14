"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useSession, getProviders, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { Session } from "next-auth";

import { BuiltInProviderType } from "next-auth/providers";

import { UserObject } from "@/interfaces/User";
import { PageObject } from "@/interfaces/Page";

type AuthProvidersType = Record<
	LiteralUnion<BuiltInProviderType, string>,
	ClientSafeProvider
> | null;

interface AppContextProps {
	pages: PageObject[];
	setPages: React.Dispatch<React.SetStateAction<PageObject[]>>;
	users: UserObject[];
	setUsers: React.Dispatch<React.SetStateAction<UserObject[]>>;
	authProviders: AuthProvidersType;
	logoScaleFactor: number;
	setLogoScaleFactor: React.Dispatch<React.SetStateAction<number>>;
	session: Session | null;
	postCardListSize: number;
	setPostCardListSize: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
	children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
	const [users, setUsers] = useState<UserObject[]>([]);
	const [pages, setPages] = useState<PageObject[]>([]);
	const [logoScaleFactor, setLogoScaleFactor] = useState(0);

	const [authProviders, setAuthProviders] = useState<AuthProvidersType>(null);
	const [postCardListSize, setPostCardListSize] = useState(0);
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
				logoScaleFactor,
				setLogoScaleFactor,
				authProviders,
				session,
				postCardListSize,
				setPostCardListSize,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
