/**
 * @see https://next-auth.js.org/configuration/nextjs#prerequisites
 */

/**
 *
 import { Route } from "@/routes";

 const publicRoutes = Object.keys(Route.public)
	.map((key) => {
		const route = Route.public[key as keyof typeof Route.public];

		if (route.visible) {
			return route.uri.slice(1);
		}
	})
	.filter((route) => route)
	.join("|");
*/

export { default } from "next-auth/middleware";

export const config = {
	matcher: [`/((?!api|_next|.*\\..*|$|home|about|contact).*)`],
};
