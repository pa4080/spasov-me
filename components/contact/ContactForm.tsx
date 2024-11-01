"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { BsSendCheck, BsSendPlus, BsSendX } from "react-icons/bs";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { type ReCaptchaRes, reCaptchaSubmit, sendEmail } from "./_contact.actions";

const t = msgs("Contact");

const formSchema = z.object({
  name: z.string().min(Number(t("form_name_minLength")), {
    message: t("form_name_error"),
  }),
  email: z.string().email({
    message: t("form_email_error"),
  }),
  message: z.string().min(Number(t("form_message_minLength")), {
    message: t("form_message_error"),
  }),
});

export type FormDataType = z.infer<typeof formSchema>;

interface Props {
  className?: string;
}

const ContactForm: React.FC<Props> = ({ className }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { toast } = useToast();

  useEffect(() => {
    let gRecaptchaBadge: HTMLElement | null;

    setTimeout(() => {
      gRecaptchaBadge = document.querySelector('[data-style="bottomright"].grecaptcha-badge');

      if (gRecaptchaBadge) {
        gRecaptchaBadge.style.translate = "0px -60px";
      }
    }, 300);

    return () => {
      if (gRecaptchaBadge) {
        gRecaptchaBadge.style.translate = "100px -60px";
      }
    };
  }, []);

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = useCallback(
    async (formData: FormDataType) => {
      let errorMsg: string | null = null;
      let reCaptcha: ReCaptchaRes | null = null;

      try {
        if (!executeRecaptcha) {
          console.warn("Execute recaptcha not yet available");

          return;
        }

        const reCaptchaRes = await executeRecaptcha("enquiryFormSubmit").then(
          (googleReCaptchaToken) => reCaptchaSubmit(googleReCaptchaToken)
        );

        if (reCaptchaRes.error || !reCaptchaRes.success) {
          errorMsg = t("toast_reCaptcha_selfError");
        }

        if (reCaptchaRes.scoreLimit > reCaptchaRes.score) {
          errorMsg = t("toast_reCaptcha_scoreError");
        }

        if (errorMsg) {
          reCaptcha = reCaptchaRes;
          throw new Error(t("toast_reCaptcha_genericError"));
        }

        toast({
          description: (
            <div className="flex flex-col items-center gap-2 justify-center w-full">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-base">{t("toast_submitted")}</span>
                <span className="text-3xl">
                  <BsSendCheck />
                </span>
              </div>

              <pre className="mt-1 rounded-md bg-slate-950 p-4 overflow-auto w-full">
                <code className="text-white">{JSON.stringify(formData, null, 2)}</code>
              </pre>
            </div>
          ),
        });

        const response = await sendEmail(formData);

        if (response.ok) {
          form.reset();

          toast({
            description: (
              <div className="flex flex-col items-center gap-2 justify-center w-full">
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-base">{t("toast_success")}</span>
                  <span className="text-3xl">
                    <BsSendCheck />
                  </span>
                </div>
              </div>
            ),
          });
        } else {
          errorMsg = t("toast_error");
          throw new Error(t("toast_errorSendingEmail", { error: String(response.error) }));
        }
      } catch (error) {
        console.error(error);

        toast({
          description: (
            <div className="flex flex-col items-center gap-2 justify-center w-full">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-base">{errorMsg}</span>
                <span className="text-3xl">
                  <BsSendX />
                </span>
              </div>

              <pre className="mt-1 rounded-md bg-slate-950 p-4 overflow-auto w-full">
                {reCaptcha && (
                  <code className="text-white">{JSON.stringify(reCaptcha, null, 2)}</code>
                )}
              </pre>
            </div>
          ),
          variant: "destructive",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [executeRecaptcha]
  );

  return (
    <div
      className={cn(
        "relative w-full flex-grow h-fit flex flex-col gap-3 sm:gap-6 px-2 py-0 sa:px-0 sa:py-2",
        className
      )}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">{t("form_name_label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form_name_placeholder")}
                    {...field}
                    autoComplete="name"
                    className="ring-offset-secondary focus-visible:ring-offset-secondary focus:ring-offset-secondary"
                  />
                </FormControl>
                {form.formState?.errors?.name ? (
                  <FormMessage className="!mt-2" />
                ) : (
                  <FormDescription>{t("form_name_description")}</FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">{t("form_email_label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form_email_placeholder")}
                    {...field}
                    autoComplete="email"
                    className="ring-offset-secondary focus-visible:ring-offset-secondary focus:ring-offset-secondary"
                  />
                </FormControl>
                {form.formState?.errors?.email ? (
                  <FormMessage className="!mt-2" />
                ) : (
                  <FormDescription>{t("form_email_description")}</FormDescription>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">{t("form_message_label")}</FormLabel>
                <FormControl>
                  <Textarea
                    className="ring-offset-secondary focus-visible:ring-offset-secondary focus:ring-offset-secondary resize-none"
                    placeholder={t("form_message_placeholder")}
                    {...field}
                  />
                </FormControl>
                {form.formState?.errors?.message ? (
                  <FormMessage className="!mt-2" />
                ) : (
                  <FormDescription>{t("form_message_description")}</FormDescription>
                )}
              </FormItem>
            )}
          />

          <Button
            className="border-2 border-foreground font-semibold text-lg text-background bg-foreground px-2 2xs:px-3 py-1 rounded-md hover:text-foreground hover:bg-muted-secondary transition-colors duration-500 hover:duration-150 hover:drop-shadow-lg opacity-95 hover:opacity-100 cursor-pointer flex items-center w-fit gap-1 xs:gap-3"
            type="submit"
          >
            {/* <span className={styles.btnText}>{messages.Buttons.submit}</span> */}
            <span className="block w-full flex-grow">{"Submit"}</span>
            <span className="text-xl w-fit">
              <BsSendPlus />
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
