import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url" | "file";
		className?: string;
		value?: string;
	}
>(({ className, type, ...props }, ref) => {
	return (
		<input
			ref={ref}
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-md file:font-medium placeholder:text-muted-foreground text-mlt-dark-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mlt-blue-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			type={type}
			{...props}
			value={props.value || ""}
		/>
	);
});

Input.displayName = "Input";

export { Input };
