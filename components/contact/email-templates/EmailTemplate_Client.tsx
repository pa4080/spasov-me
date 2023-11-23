import * as React from "react";

import { msgs } from "@/messages";

import { FormDataType } from "../ContactForm";

type EmailTemplateProps = FormDataType & {
	admin: string;
};

const EmailTemplate_Client: React.FC<Readonly<EmailTemplateProps>> = ({ name, message, admin }) => {
	const t = msgs("ContactEmail_Client");

	return (
		<div>
			<p>
				<b>{t("messageTitle", { name })}</b>
			</p>
			<br />
			<p>{t("yourMessage")}</p>
			<p>
				<em>{message}</em>
			</p>
			<br />
			<p>{t("thankYou")}</p>
			<br />
			<p>
				{t("bestRegards")} <br /> {admin}
			</p>
		</div>
	);
};

export default EmailTemplate_Client;
