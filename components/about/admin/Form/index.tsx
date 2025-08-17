"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { Paperclip, Tag } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { useForm } from "react-hook-form";

import CreateFile from "@/components/files-cloudflare/admin/Actions/CreateFile";
import Combobox from "@/components/fragments/Combobox";
import DatePicker from "@/components/fragments/DatePicker";
import DisplayEntryAttachmentInTheEditForm from "@/components/fragments/DisplayEntryAttachmentInTheEditForm";
import Loading from "@/components/fragments/Loading";
import MultiSelectFromList from "@/components/fragments/MultiSelectFromList";
import SelectFromList from "@/components/fragments/SelectFromList";
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
import { Switch } from "@/components/ui/switch";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import {
  type AboutEntryType,
  aboutEntryTuple,
  cityTuple,
  countryTuple,
} from "@/interfaces/_common-data-types";
import { msgs } from "@/messages";

import { type Entry_FormSchema, Entry_FormSchemaGenerator } from "./schema";

interface Props {
  className?: string;
  formData?: AboutEntryData;
  entryType: AboutEntryType;
  onSubmit: (data: Entry_FormSchema) => void;
  onClose?: () => void;
  submitting?: boolean;
  fileList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const AboutEntryForm: React.FC<Props> = ({
  className,
  entryType = aboutEntryTuple[0],
  formData,
  onSubmit,
  onClose,
  submitting,
  fileList,
  iconsMap,
  tags,
}) => {
  const t = msgs("AboutEntries_Form");

  const FormSchema = Entry_FormSchemaGenerator([
    t("schema_title"),
    t("schema_description"),
    t("schema_country"),
    t("schema_city"),
    t("schema_date"),
    t("schema_date"),
    t("schema_type"),
    t("schema_visibility"),
    t("schema_attachment"),
    t("schema_tags"),
    t("schema_gallery"),
  ]);

  const { theme } = useTheme();

  const form = useForm<Entry_FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      country: formData?.country ?? countryTuple[0],
      city: formData?.city ?? cityTuple[0],
      dateFrom: undefined,
      dateTo: undefined,
      entryType: entryType,
      visibility: true,
      attachment: undefined,
      tags: [],
      gallery: [],
    },
    values: formData
      ? {
          ...formData,
          tags: formData?.tags.map((tag) => tag._id) || [],
          gallery: formData?.gallery?.map((file) => file._id) ?? [],
        }
      : undefined,
  });

  if (!tags || !fileList) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form
        className={`w-full flex flex-col gap-4 relative ma:flex-grow ${className}`}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Grid */}
        <div className="flex flex-col ma:grid ma:grid-cols-7 ma:grid-rows-[1fr_auto_auto] gap-3 ma:max-h-[calc(100vh-12.4rem)] ma:flex-grow">
          {/* Left grid */}
          <div className="ma:col-span-2 flex flex-col gap-3">
            <div className="flex gap-3 ma:flex-col w-full">
              {/* Country */}
              <SelectFromList
                className="flex-1"
                control={form.control}
                error={form.formState.errors.country}
                itemsList={countryTuple.map((item) => ({
                  value: item,
                  label: (t("country_list") as unknown as Record<string, string>)[item],
                }))}
                messages={{
                  label: t("country_label"),
                  description: t("country_description"),
                  placeholder: t("country_placeholder"),
                }}
                name="country"
              />

              {/* City */}
              <SelectFromList
                className="flex-1"
                control={form.control}
                error={form.formState.errors.city}
                itemsList={cityTuple.map((item) => ({
                  value: item,
                  label: (t("city_list") as unknown as Record<string, string>)[item],
                }))}
                messages={{
                  label: t("city_label"),
                  description: t("city_description"),
                  placeholder: t("city_placeholder"),
                }}
                name="city"
              />
            </div>

            {/* Date From and Date To */}
            <div className="flex gap-3 ma:gap-1 w-full">
              {/* Date From */}
              <DatePicker
                className="flex-1"
                control={form.control}
                error={form.formState.errors.dateFrom}
                messages={{
                  placeholder: t("dateFrom_label"),
                  button: t("date_button"),
                }}
                name="dateFrom"
              />

              {/* Date To */}
              <DatePicker
                className="flex-1"
                control={form.control}
                error={form.formState.errors.dateFrom}
                messages={{
                  placeholder: t("dateTo_label"),
                  button: t("date_button"),
                }}
                name="dateTo"
              />
            </div>

            <div className="flex gap-3 flex-col 3xs:flex-row ma:flex-col w-full">
              {/* Checkbox | Is public? */}
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="flex-1 rounded-md border space-y-0">
                    <div className="flex items-center justify-between py-2 pl-4 pr-3">
                      <div>
                        <FormLabel>{t("visibility_title")}</FormLabel>
                        {t("visibility_description") && (
                          <FormDescription>{t("visibility_description")}</FormDescription>
                        )}
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {/* Entry type ["employment", "education"] */}
              <SelectFromList
                className="flex-1"
                control={form.control}
                error={form.formState.errors.entryType}
                itemsList={aboutEntryTuple.map((item) => ({
                  value: item,
                  label: (t("aboutEntry_type_list") as unknown as Record<string, string>)[item],
                }))}
                messages={{
                  label: t("type_label"),
                  description: t("type_description"),
                  placeholder: t("type_placeholder"),
                }}
                name="entryType"
              />
            </div>

            {/* Attachment (image, pdf) */}
            <div className="flex gap-1 w-full max-w-full items-center justify-center">
              <Combobox
                className="w-full"
                control={form.control}
                error={form.formState.errors.attachment}
                list={fileList ?? []}
                messages={{
                  label: t("attachment_label"),
                  description: t("attachment_description"),
                  placeholder: t("attachment_search"),
                  pleaseSelect: t("attachment_select"),
                  notFound: t("attachment_searchNotFound"),
                  selectNone: t("attachment_selectNone"),
                }}
                name="attachment"
                setValue={form.setValue}
              />
              <DisplayEntryAttachmentInTheEditForm
                currentValue={form.watch("attachment")}
                fileList={fileList}
              />
            </div>
          </div>

          {/* Right grid */}
          <div className="ma:col-span-5 flex flex-col gap-3 ma:overflow-hidden">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  {t("title_label") && <FormLabel>{t("title_label")}</FormLabel>}
                  <FormControl>
                    <Input className="text-lg" placeholder={t("title_placeholder")} {...field} />
                  </FormControl>

                  {form.formState.errors.title ? (
                    <FormMessage className="!mt-1" />
                  ) : (
                    t("title_description") && (
                      <FormDescription>{t("title_description")}</FormDescription>
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
                <FormItem
                  className="ma:flex-grow overflow-hidden"
                  data-color-mode={theme ? (theme === "dark" ? "dark" : "light") : "auto"}
                >
                  {t("description_label") && <FormLabel>{t("description_label")}</FormLabel>}
                  <FormControl>
                    <MDEditor
                      autoFocus
                      enableScroll
                      // commands={[...commands.getCommands()]}
                      height={form.formState.errors.description ? "calc(100% - 1.8em)" : "100%"}
                      overflow={false}
                      preview="edit"
                      textareaProps={{
                        spellCheck: true,
                        placeholder: t("description_placeholder"),
                        style: {
                          overscrollBehavior: "none",
                          display: "block",
                          color: "inherit",
                        },
                      }}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {form.formState.errors.description ? (
                    <FormMessage className="z-10 relative" />
                  ) : (
                    t("description_description") && (
                      <FormDescription>{t("description_description")}</FormDescription>
                    )
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Tags - full grid */}
          <MultiSelectFromList
            Icon={Tag}
            className="w-full ma:col-span-7"
            control={form.control}
            displayType="tag_icon"
            error={form.formState.errors.tags}
            iconsMap={iconsMap}
            itemsList={
              tags
                ?.sort((a, b) =>
                  a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
                )
                ?.map((tag) => ({
                  value: tag._id,
                  label: tag.name,
                  sourceImage: tag.icon,
                  sourceDescription: tag.description,
                })) ?? []
            }
            messages={{
              label: t("tags_label"),
              description: t("tags_description"),
              placeholder: t("tags_search"),
              select: t("schema_tags"),
              add: t("tags_add"),
              notFound: t("tags_searchNotFound"),
            }}
            name="tags"
            selected={form.watch("tags") || []}
            onSelect={(items: string[] | undefined) =>
              items
                ? form.setValue("tags", items, { shouldValidate: items?.length > 0 })
                : form.resetField("tags")
            }
          />

          {/* Gallery - full grid */}
          <MultiSelectFromList
            Icon={Paperclip}
            autoClearInput={false}
            className="w-full ma:col-span-7"
            control={form.control}
            displayType="gallery_image"
            error={form.formState.errors.gallery}
            iconsMap={null}
            itemsList={fileList ?? []}
            messages={{
              label: t("gallery_label"),
              description: t("gallery_description"),
              placeholder: t("gallery_search"),
              select: t("schema_gallery"),
              add: t("gallery_add"),
              notFound: t("gallery_searchNotFound"),
            }}
            name="gallery"
            selected={form.watch("gallery") || []}
            onSelect={(items: string[] | undefined) =>
              items
                ? form.setValue("gallery", items, { shouldValidate: items.length > 0 })
                : form.resetField("gallery")
            }
          />
        </div>

        {/* Submit button */}
        <div className="flex gap-3 w-full justify-between items-center">
          <div className="flex gap-3">
            <Button disabled={submitting} type="submit">
              {submitting ? t("btn_submitting") : t("btn_submit")}
            </Button>
            {!!onClose && (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
              >
                {t("btn_close")}
              </Button>
            )}
          </div>
          <CreateFile files_prefix="files" />
        </div>
      </form>
    </Form>
  );
};

export default AboutEntryForm;
