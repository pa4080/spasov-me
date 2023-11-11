/**
 * @see [Next-Auth] Tutorial with Next.js 13 @see https://youtu.be/w2h54xz6Ndw
 * @see https://next-auth.js.org/configuration/initialization#route-handlers-app
 * @see https://next-auth.js.org/getting-started/example
 * @use "openssl rand -base64 32" to generate a NEXTAUTH_SECRET
 */
import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
