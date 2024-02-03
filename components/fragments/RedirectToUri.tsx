"use client";
import React from "react";

import { useRouter } from "next/navigation";

import ButtonIcon from "@/components/fragments/ButtonIcon";

interface Props {
	className?: string;
	uri?: string;
}

const RedirectToUri: React.FC<Props> = ({ className, uri }) => {
	const router = useRouter();

	return (
		<ButtonIcon
			className={`pl-[2.8px] bg-transparent icon_accent_secondary ${className}`}
			disabled={!uri}
			height={22}
			type="up-right-from-square"
			width={22}
			onClick={() => {
				uri && router.push(uri);
			}}
		/>
	);
};

export default RedirectToUri;
