/**
 * @see https://next-auth.js.org/configuration/nextjs#prerequisites
 */

export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/((?!api|_next|.*\\..*|$|portfolio|cv|contact).*)"],
};
