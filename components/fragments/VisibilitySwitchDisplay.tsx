import React from "react";

import { Switch } from "@/components/ui/switch";

interface Props {
	className?: string;
	checked: boolean | string;
	disabled?: boolean;
}

const VisibilitySwitchDisplay: React.FC<Props> = ({ className, checked, disabled = true }) => (
	<Switch
		checked={typeof checked === "string" ? (checked === "true" ? true : false) : checked}
		className={className}
		disabled={disabled}
	/>
);

export default VisibilitySwitchDisplay;
