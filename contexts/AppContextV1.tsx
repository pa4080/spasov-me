"use client";

import { type Session } from "next-auth";
import { getProviders, useSession } from "next-auth/react";
import React, {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { type FileData } from "@/interfaces/File";
import { type PageCardData } from "@/interfaces/PageCard";
import loadDataFromApiRoute from "@/lib/load-data-fom-api-route";
import { type AuthProviders } from "@/types/next-auth-providers";

interface AppContextProps {
  session: Session | null;
  pages: PageCardData[];
  setPages: Dispatch<SetStateAction<PageCardData[]>>;
  files: FileData[];
  setFiles: Dispatch<SetStateAction<FileData[]>>;
  authProviders: AuthProviders;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [pages, setPages] = useState<PageCardData[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [authProviders, setAuthProviders] = useState<AuthProviders>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (!authProviders) {
      void (async () => {
        setAuthProviders(await getProviders());
      })();
    }

    const controller = new AbortController();

    void (async () => {
      await loadDataFromApiRoute("PAGES", setPages, controller);
      await loadDataFromApiRoute("FILES_MONGODB", setFiles, controller);
    })();

    return () => {
      controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      // eslint-disable-next-line no-console
      console.log("FILES", files);
    }

    if (pages.length > 0) {
      // eslint-disable-next-line no-console
      console.log("PAGES", pages);
    }
  }, [files, pages]);

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
