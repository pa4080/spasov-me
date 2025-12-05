/**
 * @see https://authjs.dev/getting-started/installation?framework=pnpm
 * @use "openssl rand -base64 32" to generate a NEXTAUTH_SECRET
 *
 * @deprecated [Next-Auth] Tutorial with Next.js 13 @see https://youtu.be/w2h54xz6Ndw
 * @deprecated https://next-auth.js.org/configuration/initialization#route-handlers-app
 * @deprecated https://next-auth.js.org/getting-started/example
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
