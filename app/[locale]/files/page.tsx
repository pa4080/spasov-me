import React from "react";
// import { useTranslations } from "next-intl";

// import Files_Feed from "@/components/files/Files_Feed";
import { Path } from "@/interfaces/Path";

// const getFiles = async () => {
// 	const res = await fetch("/api/files");
// 	const data = await res.json();

// 	return data;
// };

const ManageFiles: React.FC = async () => {
	// const t = useTranslations("Site");

	const files = await fetch(Path.api.FILES);

	// eslint-disable-next-line no-console
	console.log(files);

	return (
		<>
			<section>{/* <Files_Feed files={[]} /> */}</section>
		</>
	);
};

export default ManageFiles;
