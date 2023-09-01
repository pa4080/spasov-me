"use client";

import React, { useEffect } from "react";

import { Route } from "@/routes";

import Files_Feed from "@/components/files/Files_Feed";
import { useAppContext } from "@/contexts/AppContext";
import { FileObject } from "@/interfaces/File";

const ManageFiles: React.FC = () => {
	const { files, setFiles } = useAppContext();

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(Route.api.FILES);

				if (!response.ok) {
					return null;
				}

				const data: FileObject[] = (await response.json()).data;

				setFiles(data.length > 0 ? data.reverse() : []);
			} catch (error) {
				return null;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<section>
				<Files_Feed files={files} />
			</section>
		</>
	);
};

export default ManageFiles;
