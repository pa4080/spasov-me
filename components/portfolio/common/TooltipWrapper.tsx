"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
	className?: string;
	children: React.ReactNode;
	tooltipText: string;
}

const TooltipWrapper: React.FC<Props> = ({ className = "!mt-0", children, tooltipText }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className={className}>{children}</TooltipTrigger>
				<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
					<div dangerouslySetInnerHTML={{ __html: tooltipText }} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default TooltipWrapper;
