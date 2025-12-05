import { type getProviders } from "next-auth/react";

export type AuthProvidersType = Awaited<ReturnType<typeof getProviders>> | null;
