"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { useSession, getProviders, LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { Session } from "next-auth";

import { BuiltInProviderType } from "next-auth/providers";

import { PostTypeFromDb } from "@/interfaces/Post";
import { fetchPosts } from "@/lib/fetch-helpers";
import { UserObject } from "@/interfaces/User";

type AuthProvidersType = Record<
	LiteralUnion<BuiltInProviderType, string>,
	ClientSafeProvider
> | null;

interface AppContextProps {
	posts: PostTypeFromDb[];
	setPosts: React.Dispatch<React.SetStateAction<PostTypeFromDb[]>>;
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
	const [posts, setPosts] = useState<PostTypeFromDb[]>([]);
	const [users, setUsers] = useState<UserObject[]>([]);
	const [logoScaleFactor, setLogoScaleFactor] = useState(0);
	const [authProviders, setAuthProviders] = useState<AuthProvidersType>(null);
	const [postCardListSize, setPostCardListSize] = useState(0);
	const { data: session } = useSession();

	useEffect(() => {
		(async () => {
			setAuthProviders(await getProviders());
			setPosts(await fetchPosts("/api/posts"));
		})();
	}, []);

	return (
		<AppContext.Provider
			value={{
				posts,
				setPosts,
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
