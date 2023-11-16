import React from "react";
import Link from "next/link";

import messages from "@/messages/en.json";
import SiteLogo from "@/components/layouts/logo/SiteLogo";
import { Route } from "@/routes";

export default async function NotFound() {
	const { errorLong } = messages.NotFound;

	return (
		<div className="h-content flex justify-start items-center flex-col">
			<Link
				passHref
				as={Route.public.HOME}
				className="w-full margin_vh_top block"
				href={"/" + messages.NavBar.HOME.toLocaleLowerCase()}
				style={{}}
			>
				<SiteLogo
					className="w-full"
					greeting_ln1={errorLong}
					greeting_ln2="&nbsp;... back to home"
				/>
			</Link>
		</div>
	);
}
