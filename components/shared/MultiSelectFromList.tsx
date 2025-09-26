/**
 * There is not official Shadcn UI component for this.
 *
 * https://github.com/shadcn-ui/ui/issues/66
 * > https://github.com/mxkaske/mxkaske.dev/blob/main/components/craft/fancy-multi-select.tsx > This is the solution used here!
 * https://github.com/shadcn-ui/ui/discussions/859
 * > https://ui.shadcn.com/docs/components/dropdown-menu#examples
 */

import { type LucideIcon, X } from "lucide-react";
import React, { type KeyboardEvent, useCallback, useRef, useState } from "react";
import {
  type Control,
  type FieldError,
  type FieldValues,
  type Merge,
  type Path,
  type PathValue,
} from "react-hook-form";

import DisplayIcon from "@/components/shared/DisplayIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type FileData } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";

import CopyFileAddressToClipboard from "./CopyFileAddressToClipboard";
import DisplayFileImage from "./DisplayFileImage";

export interface Item<T> {
  value: PathValue<T, Path<T>>;
  label: string;
  sourceImage?: string; // tag.icon: IconMap[string];
  sourceDescription?: string; // tag.description;
}

export type ItemList<T> = Item<T>[];

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  itemsList: ItemList<T>;
  Icon: LucideIcon;
  labelMaxLength?: number;
  displayType?: "label" | "tag_icon" | "gallery_image";
  iconsMap: IconsMap | null;
  messages: {
    label?: string;
    description?: string;
    placeholder?: string;
    select?: string;
    add?: string;
    notFound?: string;
  };
  error?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  onSelect: (items: string[] | undefined) => void;
  className?: string;
  selected: string[] | undefined;
  autoClearInput?: boolean;
}

export default function MultiSelectFromList<T extends FieldValues>({
  control,
  name,
  messages,
  error,
  itemsList,
  className,
  onSelect,
  iconsMap,
  selected,
  Icon,
  labelMaxLength = 5,
  displayType = "label",
  autoClearInput = true,
}: Props<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
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

        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [onSelect, selected]
  );

  const SelectedItemRemoveBtn: React.FC<{ item: Item<T> }> = ({ item }) => (
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
      <X className="h-3 w-3 text-muted-foreground hover:text-foreground ml-0" />
    </div>
  );

  const handleUnselect = useCallback(
    (itemUnselected: Item<T>) => {
      const newSelectedItemsList =
        selected?.filter((itemSelected) => itemSelected !== itemUnselected.value) ?? [];

      onSelect(newSelectedItemsList);
    },
    [onSelect, selected]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={`w-full ${className}`}>
          {messages.label && <FormLabel>{messages.label}</FormLabel>}
          <Popover>
            <div className="flex flex-col ma:grid ma:grid-cols-7 gap-3 w-full">
              <PopoverTrigger asChild>
                <Button
                  className={`w-full justify-between bg-primary text-sm ma:col-span-2 ${
                    !field.value && "text-muted-foreground"
                  }`}
                  role="combobox"
                  variant="outline"
                >
                  <div className="line-clamp-1 text-left">{messages.add}</div>
                  <Icon className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>

              <div className="flex gap-1 flex-wrap ma:col-span-5 items-center px-1">
                {selected && selected?.length > 0 ? (
                  itemsList
                    .filter((item) => selected?.includes(item.value))
                    .map((item) => {
                      switch (displayType) {
                        case "gallery_image": {
                          if (item.sourceImage && item.sourceDescription) {
                            const itemToFile = {
                              filename: item.sourceDescription,
                              metadata: {
                                html: {
                                  fileUri: item.sourceImage,
                                },
                              },
                            } as FileData;

                            return (
                              <Badge
                                key={item.value}
                                className="h-fit text-sm font-normal tracking-wider text-foreground py-0.5 px-1 rounded-md"
                                variant="secondary"
                              >
                                <CopyFileAddressToClipboard
                                  address={itemToFile.metadata.html.fileUri ?? "none"}
                                  className="w-8 h-8 rounded-sm"
                                >
                                  <DisplayFileImage
                                    className="w-8 h-8 rounded-sm"
                                    description={item.sourceDescription}
                                    file={itemToFile}
                                    sizes={["32px", "32px"]}
                                  />
                                </CopyFileAddressToClipboard>
                                <SelectedItemRemoveBtn item={item} />
                              </Badge>
                            );
                          }
                        }

                        case "tag_icon": {
                          if (item.sourceImage && item.sourceDescription) {
                            return (
                              <Badge
                                key={item.value}
                                className="h-fit text-sm font-normal tracking-wider text-foreground py-[6px] px-1 rounded-md"
                                variant="secondary"
                              >
                                {iconsMap ? (
                                  <DisplayIcon
                                    key={item.value}
                                    className="p-0 hover:bg-transparent dark:hover:bg-transparent"
                                    className_TooltipTrigger="!mt-0"
                                    description={item.sourceDescription}
                                    icon={iconsMap[item.sourceImage]}
                                    size={24}
                                  />
                                ) : (
                                  "W: IconsMap is not provided!"
                                )}
                                <SelectedItemRemoveBtn item={item} />
                              </Badge>
                            );
                          }
                        }

                        // case "label":
                        default: {
                          const regExp = new RegExp(`^(.{${labelMaxLength}}).*$`);

                          return (
                            <Badge
                              key={item.value}
                              className="h-fit text-sm font-normal tracking-wider py-1 text-foreground"
                              variant="secondary"
                            >
                              <Icon className="ml-1 mr-2 h-3 w-3 opacity-60" />
                              <span className="inline-block mr-1">
                                {item.label.length > labelMaxLength
                                  ? item.label.replace(regExp, "$1...")
                                  : item.label}
                              </span>
                              <SelectedItemRemoveBtn item={item} />
                            </Badge>
                          );
                        }
                      }
                    })
                ) : (
                  <Badge
                    className="h-fit text-sm font-normal tracking-wider py-1"
                    variant="secondary"
                  >
                    {messages.select}
                    <Icon className="ml-2 h-3 w-3 opacity-60" />
                  </Badge>
                )}
              </div>
            </div>
            <PopoverContent className="w-full max-w-full p-0 pb-2">
              <Command className="w-full" onKeyDown={handleKeyDown}>
                <CommandInput
                  ref={inputRef}
                  className="mb-1"
                  placeholder={messages.placeholder}
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  <CommandEmpty className="py-0 px-2 text-center">{messages.notFound}</CommandEmpty>

                  <CommandGroup className="max-h-52 overflow-y-scroll">
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
                            autoClearInput && setInputValue("");
                            onSelect(selected ? [...selected, item.value] : [item.value]);
                          }}
                        >
                          {item.label}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {error ? (
            <FormMessage className="!mt-1" />
          ) : (
            messages.description && <FormDescription>{messages.description}</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
