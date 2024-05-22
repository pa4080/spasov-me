"use client";

import React from "react";
// Note: GoogleReCaptchaProvider require "use client", so we cannot include it in layout.tsx
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface Props {
	children: React.ReactNode;
}

const RecaptchaContextProvider: React.FC<Props> = ({ children }) => {
	return (
		<GoogleReCaptchaProvider
			container={{
				parameters: {
					badge: "bottomleft",
					theme: "dark",
				},
			}}
			reCaptchaKey={String(process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3E_SITE_KEY)}
			scriptProps={{
				async: true,
				defer: false,
				appendTo: "head",
				nonce: undefined,
			}}
			useEnterprise={true}
		>
			{children}
		</GoogleReCaptchaProvider>
	);
};

export default RecaptchaContextProvider;
