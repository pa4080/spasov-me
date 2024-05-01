"use client";

import dynamic from "next/dynamic";
import React from "react";

import SiteLogo from "@/components/layouts/logo/SiteLogo";

// import PublicMenu_Sheet from "./PublicMenu_Sheet";
const PublicMenu_Sheet = dynamic(() => import("./PublicMenu_Sheet"), {
	ssr: false,
	loading: () => (
		<SiteLogo
			autoBreak={false}
			className="emphasize_drop_shadow translate-y-[1px] sm:hidden"
			style={{ width: "152px", height: "28px" }}
		/>
	),
});

interface Props {
	className?: string;
}

const PublicMenu_Mobile: React.FC<Props> = () => {
	return (
		<PublicMenu_Sheet>
			<SiteLogo
				autoBreak={false}
				className="emphasize_drop_shadow translate-y-[5px] sm:hidden"
				style={{ width: "152px", height: "28px" }}
			/>
		</PublicMenu_Sheet>
	);
};

export default PublicMenu_Mobile;
