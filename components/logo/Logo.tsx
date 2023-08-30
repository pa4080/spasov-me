import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import LogoFull from "@/public/icons/svg/spasov.me.full.svg";
import LogoFullBreak from "@/public/icons/svg/spasov.me.full.break.svg";

interface Props {
	className?: string;
	greeting_ln1: string;
	greeting_ln2: string;
}

const HomePage_Logo: React.FC<Props> = ({ className, greeting_ln1, greeting_ln2 }) => {
	return (
		<div
			className={cn(
				"logo_scalable_container flex w-full justify-center items-center relative",
				"",
				className
			)}
			style={{
				zIndex: -1,
			}}
		>
			<div className="w-max h-max relative">
				<div
					className={cn(
						"absolute z-1 font-unicephalon text-mlt-gray-1 tracking-menu-items",
						// "text-[1em] xs420:text-[1.1em] sm520:text-[1.2em] sm:text-[1.4em]",
						"-right-[0.15em] -top-[0.4em] xs420:-top-[0.25em]",
						"text-[6cqw] xs420:text-[4.5cqw] sm580:text-[3.5cqw]"
					)}
				>
					<span>{greeting_ln1}</span>{" "}
					<span className="hidden sm580:inline-block">{greeting_ln2}</span>
				</div>
				<div className="emphasize_drop_shadow">
					<Image priority alt="Site logo" className="hidden sm580:block" src={LogoFull} />
					<Image priority alt="Site logo" className="block sm580:hidden" src={LogoFullBreak} />
				</div>
			</div>
		</div>
	);
};

export default HomePage_Logo;
