import { Check, ChevronsUpDown } from "lucide-react";
import {
  type Control,
  type ControllerRenderProps,
  type FieldError,
  type FieldErrorsImpl,
  type FieldValues,
  type Merge,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn-utils";

export interface ComboBoxList<T> {
  value: PathValue<T, Path<T>>;
  label: string;
}

interface Props<T extends FieldValues> {
  className?: string;
  control: Control<T>;
  list: ComboBoxList<T>[];
  name: Path<T>;
  labelMaxLength?: number;
  setValue: UseFormSetValue<T>;
  messages: {
    label: string;
    description: string;
    placeholder: string;
    pleaseSelect: string;
    notFound: string;
    selectNone: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

export default function Combobox<T extends FieldValues>({
  control,
  list,
  messages,
  name,
  setValue,
  error,
  className,
  labelMaxLength = 15,
}: Props<T>) {
  const regExp = new RegExp(`^(.{${labelMaxLength}}).*$`);

  if (!list) {
    return null;
  }

  const label = (field: ControllerRenderProps<T, Path<T>>) => {
    const label = field?.value
      ? list?.find((item) => item?.value === field?.value)?.label
      : messages?.pleaseSelect;

    return label && label?.length > labelMaxLength ? label?.replace(regExp, "$1...") : label;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {messages?.label && <FormLabel>{messages?.label}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className={`w-full justify-between bg-primary text-sm ${
                    !field?.value && "text-muted-foreground"
                  }`}
                  role="combobox"
                  variant="outline"
                >
                  <div className="line-clamp-1 text-left">{label(field)}</div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-full p-0 pb-2">
              <Command>
                <CommandInput placeholder={messages?.placeholder} />
                <CommandList>
                  <CommandEmpty>{messages?.notFound}</CommandEmpty>

                  <CommandGroup className="max-h-52 overflow-y-scroll mt-1">
                    <CommandItem
                      value={undefined}
                      onSelect={() => {
                        setValue(name, undefined as PathValue<T, Path<T>>);
                      }}
                    >
                      <PopoverClose className="w-full flex items-center justify-start">
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            field?.value === undefined ? "opacity-100" : "opacity-0"
                          }`}
                          strokeWidth={3}
                        />

                        <div className="line-clamp-1 text-left">{messages?.selectNone}</div>
                      </PopoverClose>
                    </CommandItem>

                    {list?.map((item, index) => (
                      <CommandItem
                        key={`${item?.value}_${index}`.replace(/\//g, "-")}
                        value={item?.value}
                        onSelect={() => {
                          setValue(name, item?.value);
                        }}
                      >
                        <PopoverClose className="w-full flex items-center justify-start">
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              item?.value === field?.value ? "opacity-100" : "opacity-0"
                            }`}
                            strokeWidth={3}
                          />
                          <div className="line-clamp-1 text-left">{item?.label}</div>
                        </PopoverClose>
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
            messages?.description && <FormDescription>{messages?.description}</FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
