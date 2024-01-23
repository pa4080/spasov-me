import { Dispatch, SetStateAction } from "react";

import { Route } from "@/routes";

export type LoadDataFromApiRoute = <T>(
	route: keyof typeof Route.api,
	setCallback: Dispatch<SetStateAction<T[]>>,
	controller: AbortController
) => Promise<T[]> | null;

const loadDataFromApiRoute: LoadDataFromApiRoute = async (route, setCallback, controller) => {
	try {
		const response = await fetch(Route.api[route], {
			// cache: "force-cache",
			signal: controller.signal,
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()).data;

		setCallback && setCallback(data.length > 0 ? data : []);

		return data;
	} catch (error) {
		return null;
	}
};

export default loadDataFromApiRoute;
