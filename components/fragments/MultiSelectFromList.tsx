/**
 * There is not official Shadcn UI component for this.
 *
 * https://github.com/shadcn-ui/ui/issues/66
 * > https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx > This is the solution used here!
 * https://github.com/shadcn-ui/ui/discussions/859
 * > https://ui.shadcn.com/docs/components/dropdown-menu#examples
 */

"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Command as CommandPrimitive } from "cmdk";

import { Badge } from "@/components/ui/badge";

import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

type Framework = Record<"value" | "label", string>;

const FRAMEWORKS = [
	{
		value: "next.js",
		label: "Next.js",
	},
	{
		value: "sveltekit",
		label: "SvelteKit",
	},
	{
		value: "nuxt.js",
		label: "Nuxt.js",
	},
	{
		value: "remix",
		label: "Remix",
	},
	{
		value: "astro",
		label: "Astro",
	},
	{
		value: "wordpress",
		label: "WordPress",
	},
	{
		value: "express.js",
		label: "Express.js",
	},
	{
		value: "nest.js",
		label: "Nest.js",
	},
] satisfies Framework[];

export default function MultiSelectFromList() {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<Framework[]>([FRAMEWORKS[4]]);
	const [inputValue, setInputValue] = React.useState("");

	const handleUnselect = React.useCallback((framework: Framework) => {
		setSelected((prev) => prev.filter((s) => s.value !== framework.value));
	}, []);

	const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;

		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "") {
					setSelected((prev) => {
						const newSelected = [...prev];

						newSelected.pop();

						return newSelected;
					});
				}
			}

			// This is not a default behaviour of the <input /> field
			if (e.key === "Escape") {
				input.blur();
			}
		}
	}, []);

	const itemsAvailable = FRAMEWORKS.filter((framework) => !selected.includes(framework));

	return (
		<Command className="overflow-visible bg-transparent" onKeyDown={handleKeyDown}>
			<div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
				<div className="flex gap-1 flex-wrap">
					{selected.map((framework) => {
						return (
							<Badge key={framework.value} variant="secondary">
								{framework.label}
								<button
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onClick={() => handleUnselect(framework)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(framework);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
						placeholder="Select frameworks..."
						value={inputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						onValueChange={setInputValue}
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && itemsAvailable.length > 0 ? (
					<div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
						<CommandGroup className="h-full overflow-auto">
							{itemsAvailable.map((framework) => {
								return (
									<CommandItem
										key={framework.value}
										className={"cursor-pointer"}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onSelect={() => {
											setInputValue("");
											setSelected((prev) => [...prev, framework]);
										}}
									>
										{framework.label}
									</CommandItem>
								);
							})}
						</CommandGroup>
					</div>
				) : null}
			</div>
		</Command>
	);
}
