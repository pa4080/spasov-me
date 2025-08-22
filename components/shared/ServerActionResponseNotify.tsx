"use client";

import { redirect } from "next/navigation";
import { BsSendCheck } from "react-icons/bs";

import { toast } from "@/components/ui/use-toast";

interface Props {
  trigger: boolean;
  msgSuccess: string;
  msgError: string;
  redirectTo?: string;
}

export default function serverActionResponseToastAndLocationReload({
  trigger,
  msgSuccess,
  msgError,
  redirectTo,
}: Props) {
  if (trigger && redirectTo) {
    setTimeout(() => redirect(redirectTo), 1000);
  }

  toast({
    description: (
      <div className="flex flex-col items-center gap-2 justify-center w-full">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-base">{trigger ? msgSuccess : msgError}</span>
          <span className="text-3xl">
            <BsSendCheck />
          </span>
        </div>
      </div>
    ),
    variant: trigger ? "default" : "destructive",
  });

  return null;
}
