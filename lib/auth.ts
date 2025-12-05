import NextAuth from "next-auth";

import { authOptions } from "./auth-options";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
