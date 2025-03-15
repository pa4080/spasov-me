"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
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
import { type PageCardData } from "@/interfaces/PageCard";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { updatePageCard } from "../../_pages.actions";
import PageForm from "../Form";
import { type Pages_FormSchema } from "../Form/schema";

interface Props {
  className?: string;
  page: PageCardData;
  icons: IconsMap;
  fileList: FileListItem[] | null;
}

const UpdatePage: React.FC<Props> = ({ className, page, icons, fileList }) => {
  const t = msgs("PageCards_Update");

  const [submitting, setSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
  const pathname = usePathname();

  const handleUpdatePage = async (data: Pages_FormSchema) => {
    setSubmitting(true);

    try {
      const response = await updatePageCard(generateFormDataFromObject(data), page._id, [
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
        <DialogTrigger disabled={submitting} onClick={() => setIsOpen(true)}>
          <IconEmbedSvg
            className="grayscale-[100%] hover:grayscale-[0%] mt-2"
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
              <DialogTitle>{t("dialog_title")}</DialogTitle>
              {t("dialog_description") && (
                <DialogDescription
                  dangerouslySetInnerHTML={{
                    __html: t("dialog_description", { id: page._id }),
                  }}
                />
              )}
            </div>
          </DialogHeader>

          <PageForm
            className={t("dialog_description") ? "mt-0" : "mt-1"}
            fileList={fileList}
            formData={page}
            icons={icons}
            submitting={submitting}
            onSubmit={handleUpdatePage}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdatePage;
