import React from "react";

// import colorVars from "@/app/globals.variables.module.scss";

interface Props {
	className?: string;
}

/**
 * @see https://tailwindcss.com/docs/customizing-colors
 */
const ThemeStylePreview: React.FC<Props> = ({ className }) => {
	return (
		<div
			className={`pt-4 grid grid-cols-2 gap-4 rounded w-full max-w-3xl min-w-[320px] ${className}`}
		>
			{/* background; foreground */}
			<div className="h-fit p-2 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border-2 flex justify-center items-center bg-background col-span-2 flex-wrap gap-2 flex-col">
				<div className="text-foreground">foreground</div>
				<div className="text-foreground-secondary">foreground-secondary</div>
				<div className="text-foreground-tertiary">foreground-tertiary</div>
				<div className="text-foreground-quaternary">foreground-quaternary</div>
				<div className="text-primary-foreground">primary-foreground</div>
				<div className="text-secondary-foreground">secondary-foreground</div>
				<div className="text-muted-foreground">muted-foreground</div>
				<div className="text-accent">accent</div>
				<div className="text-accent-secondary">accent-secondary</div>
				<div className="text-ring">ring</div>
				<div className="text-ring-secondary">ring-secondary</div>
				<div className="text-accent-foreground">accent-foreground</div>
				<div className="text-destructive-foreground">destructive-foreground</div>
			</div>

			{/* primary; primary-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden  flex justify-center items-center bg-primary text-primary-foreground col-span-2">
				primary
			</div>

			{/* secondary; secondary-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden  flex justify-center items-center bg-secondary text-secondary-foreground col-span-2">
				secondary
			</div>

			{/* accent; accent-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden  flex justify-center items-center bg-accent text-accent-foreground col-span-2">
				accent
			</div>

			{/* accent-secondary; accent-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden  flex justify-center items-center bg-accent-secondary text-accent-foreground col-span-2">
				accent-secondary
			</div>

			{/* ring */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-ring text-accent-foreground col-span-2">
				ring
			</div>

			{/* ring-secondary */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-ring-secondary text-accent-foreground col-span-2">
				ring-secondary
			</div>

			{/* card; card-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-card text-card-foreground col-span-2">
				card
			</div>

			{/* popover; popover-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-popover text-popover-foreground col-span-2">
				popover
			</div>

			{/* muted; muted-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-muted text-muted-foreground col-span-2">
				muted
			</div>

			{/* muted-secondary; muted-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-muted-secondary text-muted-foreground col-span-2">
				muted-secondary
			</div>

			{/* destructive; destructive-foreground */}
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden flex justify-center items-center bg-destructive text-destructive-foreground col-span-2">
				destructive
			</div>
			{/* input */}
			<input
				className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden col-span-2 p-2 border-2 border-input bg-secondary"
				placeholder="input"
			/>
		</div>
	);
};

export default ThemeStylePreview;
