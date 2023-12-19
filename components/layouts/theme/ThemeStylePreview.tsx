import React from "react";

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
			<div className="h-12 w-full rounded select-all line-clamp-1 whitespace-nowrap overflow-hidden border-2 flex justify-center items-center bg-background text-foreground col-span-2">
				background
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
