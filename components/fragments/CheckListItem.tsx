import React, { CSSProperties } from "react";

import { ThemeColorsList } from "@/interfaces/ThemeTW";

import IconEmbedSvg, { IconEmbSvgPathType } from "./IconEmbedSvg";

export interface CheckListItemType {
	size?: number;
	color?: ThemeColorsList;
	checked?: boolean;
	type?: IconEmbSvgPathType;
	style?: CSSProperties;
}

const CheckListItem: React.FC<CheckListItemType> = ({
	size = 32,
	color = "mlt-purple-bright",
	checked,
	type = "check-square",
	style,
}) => {
	let opacity1 = "40";
	let opacity2 = "00";

	if (checked) {
		opacity1 = "40";
		opacity2 = "FF";
	}

	return (
		<IconEmbedSvg
			c1={color}
			c2={color}
			height={size}
			op1={opacity1}
			op2={opacity2}
			style={style}
			type={type}
			width={size}
		/>
	);
};

export default CheckListItem;
