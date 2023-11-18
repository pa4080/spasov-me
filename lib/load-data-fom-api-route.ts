import { Dispatch, SetStateAction } from "react";

import { Route } from "@/routes";

export type LoadDataFromApiRoute = <T>(
	route: keyof typeof Route.api,
	setCallback: Dispatch<SetStateAction<T[]>>
) => void;

const loadDataFromApiRoute: LoadDataFromApiRoute = async (route, setCallback) => {
	try {
		const response = await fetch(Route.api[route]);

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()).data;

		setCallback(data.length > 0 ? data : []);
	} catch (error) {
		return null;
	}
};

export default loadDataFromApiRoute;
