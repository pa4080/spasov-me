"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { createPageCard } from "../../_pages.actions";
import PageForm from "../Form";
import { type Pages_FormSchema } from "../Form/schema";

interface Props {
  className?: string;
  icons: IconsMap;
  fileList: FileListItem[] | null;
}

const CreatePage: React.FC<Props> = ({ className, icons, fileList }) => {
  const t = msgs("PageCards_Create");

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
  const pathname = usePathname();

  const handleCreatePage = async (data: Pages_FormSchema) => {
    setSubmitting(true);

    try {
      const response = await createPageCard(generateFormDataFromObject(data), [
        pathname,
        Route.public.HOME.uri,
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
            width={42} // 62
            widthOffset={24}
            onClick={() => setIsOpen(true)}
          />
        </DialogTrigger>
        <DialogContent
          className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
          closeOnOverlayClick={false}
        >
          <DialogHeader>
            <div className="flex flex-col gap-1">
              <DialogTitle>{t("dialog_title")}</DialogTitle>
              {t("dialog_description") && (
                <DialogDescription
                  dangerouslySetInnerHTML={{
                    __html: t("dialog_description", { id: "new id" }),
                  }}
                />
              )}
            </div>
          </DialogHeader>

          <PageForm
            className="mt-1"
            fileList={fileList}
            icons={icons}
            submitting={submitting}
            onSubmit={handleCreatePage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePage;
