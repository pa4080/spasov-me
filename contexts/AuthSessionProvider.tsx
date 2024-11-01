/**
 * @see https://youtu.be/wm5gMKuwSYk?t=4550
 */
"use client";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

/**
 * While we do not have any special requirements,
 * it looks like passing { session } to the SessionProvider
 * within app/[locale]/layout.tsx is not needed...?
 *
 * https://next-auth.js.org/getting-started/client#sessionprovider
 * If you pass the session page prop to the <SessionProvider>,
 * you can avoid checking the session twice on pages that
 * support both server and client side rendering.
 */
const AuthSessionProvider: React.FC<Props> = ({ children, session }) => {
  return (
    <SessionProvider refetchInterval={15 * 60} session={session}>
      {children}
    </SessionProvider>
  );
};

export default AuthSessionProvider;
