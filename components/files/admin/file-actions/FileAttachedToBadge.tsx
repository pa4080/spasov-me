"use client";
import React from "react";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SelectedItemRemoveBtn: React.FC<{
	onClick: () => void;
}> = ({ onClick }) => (
	<div
		className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
		role="button"
		onClick={onClick}
		onMouseDown={(e) => {
			e.preventDefault();
			e.stopPropagation();
		}}
	>
		<X className="h-3 w-3 text-muted-foreground hover:text-foreground ml-0" />
	</div>
);

const TheBadge: React.FC<{
	className?: string;
	badgeText: string;
	onClick?: () => void;
}> = ({ className, badgeText, onClick }) => {
	return (
		<Badge
			className={`h-fit text-sm font-normal tracking-wider py-1 text-foreground ${className}`}
			variant="secondary"
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			onMouseDown={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			<span className="inline-block">{badgeText}</span>
			{onClick && <SelectedItemRemoveBtn onClick={onClick} />}
		</Badge>
	);
};

interface Props {
	className?: string;
	badgeLabel: string;
	badgeLabelMaxLength?: number;
	ttContentLn1?: string;
	ttContentLn2?: string;
	removeItemById?: () => void;
	collisionBoundaryRef?: React.RefObject<HTMLFormElement>;
}

const FileAttachedToBadge: React.FC<Props> = ({
	className,
	badgeLabel,
	badgeLabelMaxLength = 20,
	ttContentLn1,
	ttContentLn2,
	removeItemById,
	collisionBoundaryRef,
}) => {
	const regExp = new RegExp(`^(.{${badgeLabelMaxLength}}).*$`);
	const badgeText =
		badgeLabel.length > badgeLabelMaxLength ? badgeLabel.replace(regExp, "$1...") : badgeLabel;

	if (ttContentLn2 || ttContentLn1) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<TheBadge badgeText={badgeText} className={className} onClick={removeItemById} />
					</TooltipTrigger>
					<TooltipContent
						className="border-2 border-muted-secondary dark:border-primary max-w-xs"
						collisionBoundary={collisionBoundaryRef?.current}
					>
						{ttContentLn1 && <p className="font-semibold text-base -mt-1">{ttContentLn1}</p>}
						{ttContentLn2 && <p className="text-xs">{ttContentLn2}</p>}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return <TheBadge badgeText={badgeText} className={className} onClick={removeItemById} />;
};

export default FileAttachedToBadge;
