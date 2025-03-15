"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { updateEntry } from "@/components/about/_about.actions";
import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import Loading from "@/components/fragments/Loading";
import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/AppContext";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { type Entry_FormSchema } from "../Form/schema";

const AboutEntryForm = dynamic(() => import("../Form"), { ssr: false, loading: () => <Loading /> });

interface Props {
  className?: string;
  entry: AboutEntryData;
  fileList: FileListItem[] | null;
  tags: TagData[] | null;
  iconsMap: IconsMap;
}

const UpdateAboutEntry: React.FC<Props> = ({ className, entry, fileList, tags, iconsMap }) => {
  const t = msgs("AboutEntries_Update");
  const entryTypeLabel = (
    msgs("AboutEntries_Form")("aboutEntry_type_list") as unknown as Record<string, string>
  )[entry.entryType];

  const { session } = useAppContext();
  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleUpdateEntry = async (data: Entry_FormSchema) => {
    setSubmitting(true);
    try {
      /**
       * In case we were used <form action={addPage}> this conversion will not be needed,
       * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
       * form.action()... @see https://stackoverflow.com/a/40552372/6543935
       */

      const response = await updateEntry(generateFormDataFromObject(data), entry._id, [
        pathname,
        Route.public.ABOUT.uri,
        Route.admin.FILES_MONGODB,
        Route.admin.FILES_CFR2,
      ]);

      serverActionResponseToastAndLocationReload({
        trigger: !!response,
        msgSuccess: t("toast_success"),
        msgError: t("toast_error"),
        // redirectTo: pathname,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setIsOpen(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger disabled={submitting} onClick={() => setIsOpen(true)}>
        <IconEmbedSvg
          className={cn("grayscale-[100%] hover:grayscale-[0%]", className)}
          className_Path1="fill-accent-secondary"
          className_Path2="fill-accent"
          height={23}
          type={"screwdriver-wrench"}
          width={24}
        />
      </DialogTrigger>
      <DialogContent
        className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
        closeOnOverlayClick={false}
      >
        <DialogHeader displayClose>
          <div className="flex flex-col gap-1">
            <DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
            {t("dialog_description") && (
              <DialogDescription
                dangerouslySetInnerHTML={{
                  __html: t("dialog_description", { id: entry._id }),
                }}
              />
            )}
          </div>
        </DialogHeader>

        <AboutEntryForm
          className={t("dialog_description") ? "mt-0" : "mt-1"}
          entryType={entry.entryType}
          fileList={fileList}
          formData={entry}
          iconsMap={iconsMap}
          submitting={submitting}
          tags={tags}
          onSubmit={handleUpdateEntry}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAboutEntry;
