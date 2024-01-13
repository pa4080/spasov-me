"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth-options";

export const revalidatePaths = async <T extends string>({
	paths,
	redirectTo,
}: {
	paths: T[];
	redirectTo?: T;
}): Promise<T[] | null | void> => {
	"use server";

	try {
		paths.forEach((path) => {
			revalidatePath(path);
		});

		// redirect() cause a specific Next.js error,
		// so it must be outside the try block!

		return paths;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		if (redirectTo) {
			setTimeout(() => redirect(redirectTo), 1000);
		}
	}
};

export const getSession = async () => {
	"use server";
	const session = await getServerSession(authOptions);

	return session;
};
