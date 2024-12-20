"use server";

import { Resend } from "resend";

import { msgs } from "@/messages";
import manifest from "@/public/manifest.json";

import { type FormDataType } from "./ContactForm";
import EmailTemplate_Admin from "./Templates/EmailTemplate_Admin";
import EmailTemplate_Client from "./Templates/EmailTemplate_Client";

const reCaptcha = {
  url: String(process.env.GOOGLE_RECAPTCHA_URL),
  secretKey: String(process.env.GOOGLE_RECAPTCHA_V3E_SECRET_KEY),
  siteKey: String(process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3E_SITE_KEY),
  scoreLimit: Number(process.env.GOOGLE_RECAPTCHA_SCORE_LIMIT),
};

export type ReCaptchaRes = {
  success: boolean; // Whether the reCAPTCHA was solved
  challenge_ts: string; // The timestamp of the reCAPTCHA
  hostname: string; // The hostname of the site where the reCAPTCHA was solved
  score: number; // The score of the reCAPTCHA
  action: string; // The action of the reCAPTCHA, defined within executeRecaptcha()
  error: unknown; // CUSTOM error message
  scoreLimit: number; // CUSTOM score limit of the reCAPTCHA
};

export type reCaptchaSubmit = (token: string) => Promise<ReCaptchaRes>;

export type SendEmail = (formData: FormDataType) => Promise<{ ok: boolean; error: unknown }>;

const resend = new Resend(process.env.RESEND_API_KEY);

const admin = String(process.env.NEXT_PUBLIC_ME_FULL_NAME);
const adminEmail = String(process.env.NEXT_PUBLIC_ME_EMAIL);
const siteName = manifest.short_name;
const tContactAdmin = msgs("ContactEmail_Admin");
const tContactClient = msgs("ContactEmail_Client");

// https://resend.com/docs/send-with-nextjs
export const sendEmail: SendEmail = async (formData: FormDataType) => {
  try {
    const sendEmail_Client = await resend.emails.send({
      from: `${admin} <${adminEmail}>`,
      text: formData.message,
      to: formData.email,
      subject: tContactClient("subjectToClient", { admin, siteName }),
      react: EmailTemplate_Client({ ...formData, admin }),
    });

    if (sendEmail_Client.error) {
      throw new Error(
        "Error sending client email: " + (sendEmail_Client.error as unknown as string)
      );
    }

    const sendEmail_Admin = await resend.emails.send({
      from: `${manifest.short_name} <${adminEmail}>`,
      text: formData.message,
      to: adminEmail,
      subject: tContactAdmin("subjectToAdmin", { siteName }),
      react: EmailTemplate_Admin({ ...formData, siteName }),
    });

    if (sendEmail_Admin.error) {
      throw new Error(
        "Error sending client email: " + (sendEmail_Admin.error as unknown as string)
      );
    }

    return { ok: true, error: null };
  } catch (error) {
    console.error(error);

    return { ok: false, error };
  }
};

export const reCaptchaSubmit: reCaptchaSubmit = async (googleReCaptchaToken: string) => {
  let response: ReCaptchaRes = {
    success: false,
    challenge_ts: "",
    hostname: "",
    score: 0,
    action: "",
    error: null,
    scoreLimit: reCaptcha.scoreLimit,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const reCaptchaRes: ReCaptchaRes = await (
      await fetch(reCaptcha.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${reCaptcha.secretKey}&response=${googleReCaptchaToken}`,
        cache: "no-cache",
      })
    ).json();

    response = { ...response, ...reCaptchaRes };
  } catch (err) {
    response.error = `Something went wrong with reCAPTCHA: ${err as string}`;
  }

  return response;
};
