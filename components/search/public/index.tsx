"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn-utils";

interface Props {
	className?: string;
}

const SearchPublic: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn("w-full", className)}>
			<Input className="dark:border-muted-secondary" placeholder="Search" />
		</div>
	);
};

export default SearchPublic;
