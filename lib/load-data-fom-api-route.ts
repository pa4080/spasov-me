import { Dispatch, SetStateAction } from "react";

import { Route } from "@/routes";

export type LoadDataFromApiRoute = <T>(
	route: keyof typeof Route.api,
	setCallback?: Dispatch<SetStateAction<T[]>>
) => Promise<T[]> | null;

const loadDataFromApiRoute: LoadDataFromApiRoute = async (route, setCallback) => {
	try {
		const response = await fetch(Route.api[route], {
			cache: "force-cache",
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
