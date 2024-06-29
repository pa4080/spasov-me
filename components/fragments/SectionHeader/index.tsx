import React from "react";

import { cn } from "@/lib/cn-utils";

interface Props {
	className?: string;
	className_Actions?: string;
	children?: React.ReactNode;
	iconComponent?: React.ReactNode;
	title: string;
	label?: string;
}

/**
 * The { children } prop is expected to mb the section action buttons.
 */
const SectionHeader: React.FC<Props> = ({
	className,
	className_Actions,
	children,
	title,
	label,
	iconComponent,
}) => {
	return (
		<div
			className={cn(
				"2xs:flex 2xs:flex-row-reverse items-start justify-between gap-6 2xs:gap-4 mb-8 w-full scroll-m-6",
				className
			)}
		>
			<div
				className={cn(
					"flex gap-2 float-right mb-2 select-none scale-75 2xs:scale-100 origin-top-right",
					className_Actions
				)}
			>
				{children}
			</div>
			<div className="h-fit">
				<h1
					dangerouslySetInnerHTML={{ __html: title }}
					className="font-unicephalon text-2xl 2xs:text-3xl tracking-wider text-foreground-secondary flex-grow hyphens-auto"
				/>
				{label && <p className="pl-1 text-secondary-foreground">{label}</p>}
			</div>

			{iconComponent}
		</div>
	);
};

export default SectionHeader;
