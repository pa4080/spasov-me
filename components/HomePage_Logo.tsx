import React from "react";

import SiteLogo_AutoBreak from "@/components/fragments/SiteLogo_AutoBreak";

interface Props {
	greeting_ln1: string;
	greeting_ln2: string;
}

const HomePage_Logo: React.FC<Props> = ({ greeting_ln1, greeting_ln2 }) => {
	return (
		<div className="scale-90 xs320:scale-100 xs:scale-125 sm:scale-150 md:scale-[218%] flex w-full justify-center items-center">
			<div className="w-max relative">
				<div className="absolute z-10 font-Unicephalon text-[14px] xs420:text-[12px] xs480:text-[10px] text-mlt-gray-1 right-[2px] -top-[4px] xs420:-top-[2px] tracking-menu-items">
					<span>{greeting_ln1}</span>{" "}
					<span className="hidden xs420:inline-block">{greeting_ln2}</span>
				</div>
				<div className="emphasize_drop_shadow">
					<SiteLogo_AutoBreak size="3xl" textBreakpoint="xs420" />
				</div>
			</div>
		</div>
	);
};

export default HomePage_Logo;
