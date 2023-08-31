"use client";

import React, { useEffect } from "react";

import { Route } from "@/routes";

import Files_Feed from "@/components/files/Files_Feed";
import { useAppContext } from "@/contexts/AppContext";

const ManageFiles: React.FC = () => {
	const { files, setFiles } = useAppContext();

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(Route.api.FILES);

				if (!response.ok) {
					return null;
				}

				const data = (await response.json()).data;

				setFiles(data.length > 0 ? data : []);
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
