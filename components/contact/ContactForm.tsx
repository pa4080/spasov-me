"use client";

import React, { useCallback, useRef } from "react";

// Note: GoogleReCaptchaProvider require "use client", so we cannot include it in layout.tsx
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { BsSendPlus, BsSendCheck, BsSendX } from "react-icons/bs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/components/ui/use-toast";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import messages from "@/messages/en.json";

import { cn } from "@/lib/cn-utils";

import styles from "./_contact.module.scss";

import type { ReCaptchaRes, reCaptchaSubmit, SendEmail } from ".";

const formMsgs = messages.Contact.form;

const formSchema = z.object({
	name: z.string().min(formMsgs.name.minLength, {
		message: formMsgs.name.error,
	}),
	email: z.string().email({
		message: formMsgs.email.error,
	}),
	message: z.string().min(formMsgs.message.minLength, {
		message: formMsgs.message.error,
	}),
});

export type FormDataType = z.infer<typeof formSchema>;

interface Props {
	className?: string;
	sendEmail: SendEmail;
	reCaptchaSubmit: reCaptchaSubmit;
}

const ContactForm: React.FC<Props> = ({ className, sendEmail, reCaptchaSubmit }) => {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const { toast } = useToast();
	const ref = useRef(null);

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
					errorMsg = messages.Contact.toast.reCaptcha.selfError;
				}

				if (reCaptchaRes.scoreLimit > reCaptchaRes.score) {
					errorMsg = messages.Contact.toast.reCaptcha.scoreError;
				}

				if (errorMsg) {
					reCaptcha = reCaptchaRes;
					throw new Error("Recaptcha error...");
				}

				toast({
					description: (
						<div className="flex flex-col items-center gap-2 justify-center w-full">
							<div className="flex items-center gap-2 justify-between">
								<span className="text-base">{messages.Contact.toast.submitted}</span>
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
									<span className="text-base">{messages.Contact.toast.success}</span>
									<span className="text-3xl">
										<BsSendCheck />
									</span>
								</div>
							</div>
						),
					});
				} else {
					errorMsg = messages.Contact.toast.error;
					throw new Error("Error sending email: " + response.error);
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
		<div ref={ref} className={cn(styles.formContainer, className)}>
			<Form {...form}>
				<form
					className={styles.form}
					onSubmit={form.handleSubmit(onSubmit)}
					// whileInView={{ opacity: 1 }}
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className={styles.fieldLabel}>{formMsgs.name.label}</FormLabel>
								<FormControl>
									<Input placeholder={formMsgs.name.placeholder} {...field} autoComplete="name" />
								</FormControl>
								{form.formState?.errors?.name ? (
									<FormMessage />
								) : (
									<FormDescription>{formMsgs.name.description}</FormDescription>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className={styles.fieldLabel}>{formMsgs.email.label}</FormLabel>
								<FormControl>
									<Input placeholder={formMsgs.email.placeholder} {...field} autoComplete="email" />
								</FormControl>
								{form.formState?.errors?.email ? (
									<FormMessage />
								) : (
									<FormDescription>{formMsgs.email.description}</FormDescription>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel className={styles.fieldLabel}>{formMsgs.message.label}</FormLabel>
								<FormControl>
									<Textarea
										className="resize-none"
										placeholder={formMsgs.message.placeholder}
										{...field}
									/>
								</FormControl>
								{form.formState?.errors?.message ? (
									<FormMessage />
								) : (
									<FormDescription>{formMsgs.message.description}</FormDescription>
								)}
							</FormItem>
						)}
					/>

					<Button className={styles.button} type="submit">
						{/* <span className={styles.btnText}>{messages.Buttons.submit}</span> */}
						<span className={styles.btnText}>{"Submit"}</span>
						<span className={styles.btnIcon}>
							<BsSendPlus />
						</span>
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default ContactForm;
