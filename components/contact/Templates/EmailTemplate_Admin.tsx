import * as React from "react";

import { msgs } from "@/messages";

import { type FormDataType } from "../ContactForm";

type EmailTemplateProps = FormDataType & {
  siteName: string;
};

const EmailTemplate_Admin: React.FC<Readonly<EmailTemplateProps>> = ({
  name: clientName,
  message: theMessage,
  email: theClientEmail,
  siteName,
}) => {
  const t = msgs("ContactEmail_Admin");

  return (
    <div>
      <p>
        <b>{t("subjectToAdmin", { siteName })}</b>
      </p>
      <p>
        {t("clientNameMsg")} <b>{clientName}</b>
      </p>
      <p>
        {t("clientEmailMsg")} <b>{theClientEmail}</b>
      </p>
      <p>{t("theMessageMsg")}</p>
      <p>
        <em>{theMessage}</em>
      </p>
    </div>
  );
};

export default EmailTemplate_Admin;
