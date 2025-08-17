"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useCallback, useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
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
import { type LabEntryType } from "@/interfaces/_common-data-types";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { createLabEntry } from "../../_lab.actions";
import { type LabEntry_FormSchema } from "../Form/schema";
// import LabEntryForm from "../Form";
const LabEntryForm = dynamic(() => import("../Form"), {
  ssr: false,
  loading: () => <Loading height="100%" maxHeight="100%" />,
});

interface Props {
  className?: string;
  type?: LabEntryType;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

const CreateLabEntry: React.FC<Props> = ({
  className,
  type = "application",
  fileList,
  iconList,
  tags,
  iconsMap,
}) => {
  const t = msgs("LabEntries_Create");
  const entryTypeLabel = (
    msgs("LabEntries_Form")("lab_entry_type_list") as unknown as Record<string, string>
  )[type];

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
  const pathname = usePathname();

  const handleCreateLabEntry = useCallback(
    async (data: LabEntry_FormSchema) => {
      setSubmitting(true);

      try {
        /**
         * In case we were used <form action={addPage}> this conversion will not be needed,
         * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
         * form.action()... @see https://stackoverflow.com/a/40552372/6543935
         */

        const response = await createLabEntry(generateFormDataFromObject(data), [
          pathname,
          Route.public.BLOG.uri,
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
        // setIsOpen(false);
      }
    },
    [pathname, t]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger disabled={submitting}>
          <ButtonIcon
            className="pl-[0.75rem] pr-[0.7rem] rounded-lg icon_accent_secondary"
            height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
            label={t("dialog_btn_add")}
            labelSubmitting={t("dialog_btn_add_submitting")}
            submitting={submitting}
            type="rectangle-history-circle-plus"
            width={42} // 62
            widthOffset={24}
            onClick={() => setIsOpen(true)}
          />
        </DialogTrigger>
        <DialogContent
          className="ma:max-w-[calc(100%_-_2rem)] ma:w-full ma:h-[calc(100%_-_2rem)] flex flex-col"
          closeOnOverlayClick={false}
        >
          <DialogHeader>
            <div className="flex flex-col gap-1">
              <DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
              {t("dialog_description") && (
                <DialogDescription
                  dangerouslySetInnerHTML={{
                    __html: t("dialog_description", { id: "new id" }),
                  }}
                />
              )}
            </div>
          </DialogHeader>

          <LabEntryForm
            className="mt-1"
            entryType={type}
            fileList={fileList}
            iconList={iconList}
            iconsMap={iconsMap}
            submitting={submitting}
            tags={tags}
            onClose={handleClose}
            onSubmit={handleCreateLabEntry}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateLabEntry;
