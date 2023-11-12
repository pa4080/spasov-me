import React from "react";

import messages from "@/messages/en.json";

import SiteLogo from "@/components/logo/SiteLogo";

const notFound: React.FC = () => {
	const { errorLong } = messages.NotFound;

	return (
		<div className="h-content flex justify-center items-center flex-col gap-6">
			<SiteLogo className="w-full" greeting_ln1={errorLong} />
			{/* <h1 className="text-foreground text-center flex flex-col items-center gap-6">
				<span className="text-5xl font-unicephalon">{error}</span>
				<span className="text-base xs:text-lg sm:text-xl">{errorDesc}</span>
			</h1> */}
		</div>
	);
};

export default notFound;
