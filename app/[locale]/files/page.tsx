import React from "react";
import { useTranslations } from "next-intl";

import { Route } from "@/routes";

import Files_Feed from "@/components/files/Files_Feed";

const getFiles = async () => {
	try {
		const res = await fetch(Route.api.FILES);
		const data = await res.json();

		return data;
	} catch (error) {
		console.warn(error);
	}
};

const ManageFiles: React.FC = async () => {
	// const t = useTranslations("Site");

	const files = getFiles();

	// eslint-disable-next-line no-console
	console.log(files);

	return (
		<>
			<section>{/* <Files_Feed files={[]} /> */}</section>
		</>
	);
};

export default ManageFiles;
