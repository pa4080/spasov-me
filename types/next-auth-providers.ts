import { LiteralUnion, ClientSafeProvider } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";

export type AuthProviders = Record<
	LiteralUnion<BuiltInProviderType, string>,
	ClientSafeProvider
> | null;
