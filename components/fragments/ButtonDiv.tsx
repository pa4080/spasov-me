import React from "react";

interface Props {
	className?: string;
	submitting?: boolean;
	label?: string;
	labelSubmitting?: string;
	onClick?: (e: React.SyntheticEvent) => void;
}

const ButtonDiv: React.FC<Props> = ({
	className,
	submitting,
	label = "Submit",
	labelSubmitting = "Submitting...",
	onClick,
}) => {
	return (
		<div
			className={`rounded-full bg-mlt-dark-4 hover:bg-mlt-gray-4 text-mlt-gray-2 hover:text-mlt-dark-3 transition-colors duration-200 py-1 px-4 md:py-2 md:px-6 font-unicephalon tracking-widest text-sm md:text-md ${className}`}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				if (submitting) {
					return;
				}

				if (typeof onClick === "function") {
					onClick(e);
				}
			}}
		>
			{submitting ? labelSubmitting : label}
		</div>
	);
};

export default ButtonDiv;
