"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import AttachedToBadge from "@/components/shared/AttachedToBadge";
import Combobox from "@/components/shared/Combobox";
import DisplayIcon from "@/components/shared/DisplayIcon";
import SelectFromList from "@/components/shared/SelectFromList";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type AttachedToDocument, type TagType, tagTuple } from "@/interfaces/_common-data-types";
import { capitalize } from "@/lib/capitalize";
import { msgs } from "@/messages";

import { type Tag_FormSchema, Tag_FormSchemaGenerator } from "./schema";

interface Props {
  className?: string;
  formData?: Tag_FormSchema;
  tagType: TagType;
  onSubmit: (data: Tag_FormSchema) => void;
  submitting?: boolean;
  iconsMap: IconsMap;
}

const TagForm: React.FC<Props> = ({
  className,
  tagType = tagTuple[0],
  formData,
  onSubmit,
  submitting,
  iconsMap,
}) => {
  const t = msgs("Tags_Form");
  const tCard = msgs("Tags_Display");
  const collisionBoundaryRef = useRef<HTMLFormElement>(null);

  const FormSchema = Tag_FormSchemaGenerator([
    t("schema_name_length"),
    t("schema_name_monolite"),
    t("schema_description"),
    t("schema_icon"),
    t("schema_orderKey"),
    t("schema_type"),
  ]);

  const form = useForm<Tag_FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
      tagType: tagType,
      orderKey: "",
    },
    values: formData,
  });

  const [attachedTo, setAttachedTo] = useState<AttachedToDocument[] | null>(null);

  useEffect(() => {
    setAttachedTo((form?.watch("attachedTo") as AttachedToDocument[]) ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, form.watch("attachedTo")]);

  const removeAttachedToItemById = (id: string) => {
    form.setValue("attachedTo", attachedTo?.filter(({ _id }) => _id !== id) ?? []);
  };

  return (
    <Form {...form}>
      <form
        ref={collisionBoundaryRef}
        className={`w-full space-y-4 ${className}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-3">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                {t("name_label") && <FormLabel>{t("name_label")}</FormLabel>}
                <FormControl>
                  <Input className="text-lg" placeholder={t("name_placeholder")} {...field} />
                </FormControl>

                {form.formState.errors.name ? (
                  <FormMessage className="!mt-1" />
                ) : (
                  t("name_description") && (
                    <FormDescription>{t("name_description")}</FormDescription>
                  )
                )}
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-0">
                {t("description_label") && <FormLabel>{t("description_label")}</FormLabel>}
                <FormControl>
                  <Input placeholder={t("description_placeholder")} {...field} />
                </FormControl>

                {form.formState.errors.description ? (
                  <FormMessage className="!mt-1" />
                ) : (
                  t("description_description") && (
                    <FormDescription>{t("description_description")}</FormDescription>
                  )
                )}
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
            {/* Icon */}
            <div className="sm:flex-[2] flex flex-row gap-1">
              <Combobox
                className="w-full"
                control={form.control}
                error={form.formState.errors.icon}
                list={Object.keys(iconsMap).map((icon) => ({
                  value: icon,
                  label: icon,
                }))}
                messages={{
                  label: t("icon_label"),
                  description: t("icon_description"),
                  placeholder: t("icon_search"),
                  pleaseSelect: t("icon_select"),
                  notFound: t("icon_searchNotFound"),
                  selectNone: t("icon_selectNone"),
                }}
                name="icon"
                setValue={form.setValue}
              />

              <div className="max-h-full h-full min-w-fit border rounded-md bg-primary flex items-center justify-center p-1">
                <DisplayIcon
                  className="hover:bg-transparent dark:hover:bg-transparent"
                  icon={iconsMap[form.watch("icon") ?? "placeholder"]}
                />
              </div>
            </div>

            {/* Order key */}
            <FormField
              control={form.control}
              name="orderKey"
              render={({ field }) => (
                <FormItem className="space-y-0 sm:flex-1">
                  {t("orderKey_label") && <FormLabel>{t("orderKey_label")}</FormLabel>}
                  <FormControl>
                    <Input placeholder={t("orderKey_placeholder")} {...field} />
                  </FormControl>

                  {form.formState.errors.orderKey ? (
                    <FormMessage className="!mt-1" />
                  ) : (
                    t("orderKey_description") && (
                      <FormDescription>{t("orderKey_description")}</FormDescription>
                    )
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Tag type ["technology", "skill"] */}
          <SelectFromList
            className="flex-1"
            control={form.control}
            error={form.formState.errors.tagType}
            itemsList={tagTuple.map((item) => ({
              value: item,
              label: (t("tag_type_list") as unknown as Record<string, string>)[item],
            }))}
            messages={{
              label: t("type_label"),
              description: t("type_description"),
              placeholder: t("type_placeholder"),
            }}
            name="tagType"
          />
        </div>

        <div className="flex flex-wrap gap-2 !mt-4">
          {attachedTo &&
            attachedTo.length > 0 &&
            attachedTo.map((item, index) => (
              <AttachedToBadge
                key={index}
                badgeLabel={item.title}
                collisionBoundaryRef={collisionBoundaryRef}
                removeItemById={() => removeAttachedToItemById(item._id)}
                ttContentLn1={`${capitalize(item.modelType)}: ${item.title}`}
                ttContentLn2={tCard("index_id", { index, id: item._id })}
              />
            ))}
        </div>

        <Button disabled={submitting} type="submit">
          {submitting ? t("btn_submitting") : t("btn_submit")}
        </Button>
      </form>
    </Form>
  );
};

export default TagForm;
