import React from "react";
import Link from "next/link";

import messages from "@/messages/en.json";
import SiteLogo from "@/components/logo/SiteLogo";
import { Route } from "@/routes";

export default async function NotFound() {
	const { errorLong } = messages.NotFound;

	return (
		<div className="h-content flex justify-center items-center flex-col gap-6">
			<Link
				passHref
				as={Route.public.HOME}
				className="w-full"
				href={"/" + messages.NavBar.HOME.toLocaleLowerCase()}
				style={{}}
			>
				<SiteLogo
					className="w-full"
					greeting_ln1={errorLong}
					greeting_ln2="&nbsp;... back to home"
				/>
			</Link>
			{/* <h1 className="text-foreground text-center flex flex-col items-center gap-6">
				<span className="text-5xl font-unicephalon">{error}</span>
				<span className="text-base xs:text-lg sm:text-xl">{errorDesc}</span>
			</h1> */}
		</div>
	);
}
