import { cn } from "@/lib/cn-utils";

import ContactForm from "./ContactForm";

interface Props {
  className?: string;
}

const ContactFormWrapper: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative mx-auto my-12 sa:my-auto select-none flex justify-center items-start sa:items-center w-full max-w-screen-1xl bg-secondary px-5 py-3 rounded-2xl",
        className
      )}
    >
      <div className="h-fit w-full">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactFormWrapper;
