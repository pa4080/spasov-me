/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * There is not official Shadcn UI component for this.
 *
 * https://github.com/shadcn-ui/ui/issues/66
 * > https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx > This is the solution used here!
 * https://github.com/shadcn-ui/ui/discussions/859
 * > https://ui.shadcn.com/docs/components/dropdown-menu#examples
 */

"use client";

import { KeyboardEvent, useCallback, useRef, useState } from "react";

import { Control, FieldError, FieldValues, Merge, Path, PathValue } from "react-hook-form";

import { Tag, X } from "lucide-react";

import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// import { Command as CommandPrimitive } from "cmdk";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface Item<T> {
	value: PathValue<T, Path<T>>;
	label: string;
}

export type ItemList<T> = Item<T>[];

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	itemsList: ItemList<T>;
	messages: {
		label?: string;
		description?: string;
		placeholder?: string;
	};
	error?: Merge<FieldError, (FieldError | undefined)[]>;
	className?: string;
	onSelect: (items: string[] | undefined) => void;
	selected: string[] | undefined;
}

export default function MultiSelectFromList<T extends FieldValues>({
	control,
	name,
	messages,
	error,
	itemsList,
	className,
	onSelect,
	selected,
}: Props<T>) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState("");
	// const [selectedItems, setSelectedItems] = useState<ItemList<T>>(
	// 	itemsList.filter((item) => selected?.includes(item.value)) || []
	// );

	const handleUnselect = useCallback(
		(itemUnselected: Item<T>) => {
			const newSelectedItemsList =
				selected?.filter((itemSelected) => itemSelected !== itemUnselected.value) || [];

			onSelect(newSelectedItemsList);
		},
		[onSelect, selected]
	);

	const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;

		if (input) {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (input.value === "") {
					if (selected) {
						const newSelectedItemsList = [...selected];

						newSelectedItemsList.pop();
						onSelect(newSelectedItemsList);
					}
				}
			}

			// This is not a default behaviour of the <input /> field
			// if (e.key === "Escape") {
			// 	input.blur();
			// }
		}
	}, []);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={`w-full ${className}`}>
					{messages.label && <FormLabel>{messages.label}</FormLabel>}
					<Popover>
						<div className="flex flex-col sm:grid sm:grid-cols-7 gap-3 w-full">
							<PopoverTrigger asChild>
								<Button
									className={`w-full justify-between bg-primary text-sm sm:col-span-2 ${
										!field.value && "text-muted-foreground"
									}`}
									role="combobox"
									variant="outline"
								>
									<div className="line-clamp-1 text-left">Add tags</div>
									<Tag className="ml-2 h-4 w-4 shrink-0 opacity-60" />
								</Button>
							</PopoverTrigger>

							<div className="flex gap-1 flex-wrap sm:col-span-5 items-center px-1">
								{selected && selected?.length > 0 ? (
									itemsList
										.filter((item) => selected?.includes(item.value))
										.map((item) => {
											return (
												<Badge
													key={item.value}
													className="h-fit text-sm font-normal tracking-wider py-1 text-foreground"
													variant="secondary"
												>
													<Tag className="ml-1 mr-2 h-3 w-3 opacity-60" />
													{item.label}
													<div
														className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
														role="button"
														onClick={() => handleUnselect(item)}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																handleUnselect(item);
															}
														}}
														onMouseDown={(e) => {
															e.preventDefault();
															e.stopPropagation();
														}}
													>
														<X className="h-3 w-3 text-muted-foreground hover:text-foreground ml-1" />
													</div>
												</Badge>
											);
										})
								) : (
									<Badge
										className="h-fit text-sm font-normal tracking-wider py-1"
										variant="secondary"
									>
										Select at least one tag from the list
										<Tag className="ml-2 h-3 w-3 opacity-60" />
									</Badge>
								)}
							</div>
						</div>
						<PopoverContent className="w-full max-w-full p-0 pb-2">
							<Command className="w-full" onKeyDown={handleKeyDown}>
								<CommandInput
									placeholder={messages.placeholder}
									value={inputValue}
									onValueChange={setInputValue}
								/>
								<CommandEmpty>{"messages.notFound"}</CommandEmpty>

								<CommandGroup className="max-h-52 overflow-y-scroll mt-1">
									{itemsList
										.filter((itemAvailable) => !selected?.includes(itemAvailable.value))
										.map((item) => (
											<CommandItem
												key={item.value}
												className={"cursor-pointer"}
												onMouseDown={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
												onSelect={() => {
													setInputValue("");

													onSelect(selected ? [...selected, item.value] : [item.value]);
												}}
											>
												{item.label}
											</CommandItem>
										))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>

					{error ? (
						<FormMessage />
					) : (
						messages.description && <FormDescription>{messages.description}</FormDescription>
					)}
				</FormItem>
			)}
		/>
	);
}
