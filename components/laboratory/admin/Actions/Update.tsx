"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

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
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type LabEntryData } from "@/interfaces/LabEntry";
import { type TagData } from "@/interfaces/Tag";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { updateLabEntry } from "../../_lab.actions";
import { type LabEntry_FormSchema } from "../Form/schema";

const LabEntryForm = dynamic(() => import("../Form"), { ssr: false, loading: () => <Loading /> });

interface Props {
  className?: string;
  labEntry: LabEntryData;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const UpdateLabEntry: React.FC<Props> = ({
  className,
  labEntry,
  fileList,
  iconList,
  iconsMap,
  tags,
}) => {
  const t = msgs("LabEntries_Update");
  const entryTypeLabel = (
    msgs("LabEntries_Form")("lab_entry_type_list") as unknown as Record<string, string>
  )[labEntry.entryType];

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { session } = useAppContext();

  const handleUpdateLabEntry = async (data: LabEntry_FormSchema) => {
    setSubmitting(true);
    try {
      /**
       * In case we were used <form action={addPage}> this conversion will not be needed,
       * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
       * form.action()... @see https://stackoverflow.com/a/40552372/6543935
       */

      const response = await updateLabEntry(generateFormDataFromObject(data), labEntry._id, [
        pathname,
        Route.public.LAB.uri,
        Route.admin.LAB,
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
      <DialogTrigger
        className={className}
        disabled={submitting}
        id="lab-entry-update-button"
        onClick={() => setIsOpen(true)}
      >
        <IconEmbedSvg
          className="grayscale-[100%] hover:grayscale-[0%]"
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
        <DialogHeader>
          <div className="flex flex-col gap-1">
            <DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
            {t("dialog_description") && (
              <DialogDescription
                dangerouslySetInnerHTML={{
                  __html: t("dialog_description", { id: labEntry._id }),
                }}
              />
            )}
          </div>
        </DialogHeader>

        <LabEntryForm
          className={t("dialog_description") ? "mt-0" : "mt-1"}
          entryType={labEntry.entryType}
          fileList={fileList}
          formData={labEntry}
          iconList={iconList}
          iconsMap={iconsMap}
          submitting={submitting}
          tags={tags}
          onSubmit={handleUpdateLabEntry}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLabEntry;
