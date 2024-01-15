"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth-options";

export const revalidatePaths = async <T extends string>({
	paths,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	redirectTo,
}: {
	paths: T[];
	redirectTo?: T;
}): Promise<T[] | null | void> => {
	try {
		paths.forEach((path) => {
			revalidatePath(path);
		});

		return paths;
	} catch (error) {
		console.error(error);

		return null;
	}
	/**
	 * redirect() cause a specific Next.js error, so it must be outside the try block!
	 * Actually the errors generates by redirect() causes internal server error in production.
	 * We are refreshing the page via a client side component @see ServerActionResponseNotify.tsx
	 *
	 finally {
	 	if (redirectTo) {
	 		setTimeout(() => redirect(redirectTo), 1000);
	 	}
	 }
	 */
};

export const getSession = async () => {
	const session = await getServerSession(authOptions);

	return session;
};
