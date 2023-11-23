import * as React from "react";

import messages from "@/messages/en.json";

import { FormDataType } from "../ContactForm";

const msg = messages.Contact.emailContentClint;

type EmailTemplateProps = FormDataType;

const EmailTemplate_Client: React.FC<Readonly<EmailTemplateProps>> = ({ name, message }) => (
	<div>
		<p>
			<b> {msg.hello.replace(/{\s*client\s*}/, name)} </b>
		</p>
		<p> {msg.yourMessage} </p>
		<p>
			<em> {message} </em>
		</p>
		<br />
		<p> {msg.thankYou} </p>
		<p>
			{msg.bestRegards} <br /> {process.env.NEXT_PUBLIC_ME_FULL_NAME}
		</p>
	</div>
);

export default EmailTemplate_Client;
