import { type Dispatch, type SetStateAction } from "react";

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const data = (await response.json())?.data;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setCallback && setCallback(data?.length > 0 ? data : []);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export default loadDataFromApiRoute;
