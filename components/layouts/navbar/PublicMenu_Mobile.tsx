"use client";

import dynamic from "next/dynamic";
import React from "react";

import SiteLogo from "@/components/layouts/logo/SiteLogo";

// import PublicMenu_Sheet from "./PublicMenu_Sheet";
const PublicMenu_Sheet = dynamic(() => import("./PublicMenu_Sheet"), {
	ssr: false,
	loading: () => (
		// See the indexedDB.tsx file
		<div className="flex sm:hidden items-center justify-center gap-4 pb-0">
			<SiteLogo
				autoBreak={false}
				className="emphasize_drop_shadow"
				style={{ width: "152px", height: "28px" }}
			/>
		</div>
	),
});

interface Props {
	className?: string;
}

const PublicMenu_Mobile: React.FC<Props> = ({ className }) => {
	return (
		<PublicMenu_Sheet className={className}>
			<SiteLogo
				autoBreak={false}
				className="emphasize_drop_shadow"
				style={{ width: "152px", height: "28px" }}
			/>
		</PublicMenu_Sheet>
	);
};

export default PublicMenu_Mobile;
