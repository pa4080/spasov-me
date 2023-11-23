"use client";

import React from "react";
// Note: GoogleReCaptchaProvider require "use client", so we cannot include it in layout.tsx
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import ContactForm from "./ContactForm";

import type { reCaptchaSubmit, SendEmail } from ".";

interface Props {
	reCaptchaSiteKey: string;
	contactForm: {
		className?: string;
		sendEmail: SendEmail;
		reCaptchaSubmit: reCaptchaSubmit;
	};
}

const RecaptchaContextWrapper: React.FC<Props> = ({ reCaptchaSiteKey, contactForm }) => {
	return (
		<GoogleReCaptchaProvider
			container={{
				parameters: {
					badge: "bottomleft",
					theme: "dark",
				},
			}}
			reCaptchaKey={reCaptchaSiteKey}
			scriptProps={{
				async: true,
				defer: false,
				appendTo: "head",
				nonce: undefined,
			}}
			useEnterprise={true}
		>
			<ContactForm {...contactForm} />
		</GoogleReCaptchaProvider>
	);
};

export default RecaptchaContextWrapper;
