"use client";
import React from "react";

import { useRouter } from "next/navigation";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { Route } from "@/routes";

interface Props {
	className?: string;
	uri?: string;
}

const DisplayAttachment: React.FC<Props> = ({ className, uri }) => {
	const router = useRouter();

	return (
		<ButtonIcon
			className={`pl-[2.8px] bg-transparent icon_accent_secondary ${className}`}
			disabled={!uri}
			height={22}
			type="up-right-from-square"
			width={22}
			onClick={() => {
				router.push(`${Route.api.FILES}/${uri}`);
			}}
		/>
	);
};

export default DisplayAttachment;
