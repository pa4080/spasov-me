import Link from "next/link";

import SiteLogo from "@/components/layouts/logo/SiteLogo";
import { Route } from "@/routes";

import { msgs } from "@/messages";

export default async function NotFound() {
	// const tNav = msgs("Navigation");
	const tErr = msgs("NotFound");

	return (
		<div className="h-content flex justify-start items-center flex-col">
			<Link
				passHref
				as={Route.public.HOME.uri}
				className="w-full margin_vh_top block"
				// This is a workaround for a Next.js bug, where
				// the home page is not rerendered after 404 error
				// which is rendered on the the same URI.
				href={Route.public.HOME.uri}
				style={{}}
			>
				<SiteLogo
					className="w-full"
					greeting_ln1={tErr("errorLong")}
					greeting_ln2="&nbsp;... back to home"
				/>
			</Link>
		</div>
	);
}
