import ContactForm from "@/components/contact";
import { msgs } from "@/messages";

const Contact: React.FC = () => {
  const t = msgs("Contact");

  return (
    <div className="margin_vh_top margin_vh_bottom scroll-mt-40">
      <h1 className="section_title">{t("title")}</h1>
      <ContactForm />
    </div>
  );
};

export default Contact;
