import React from "react";

import RecaptchaContextProvider from "@/contexts/RecaptchaContextProvider";

interface ReCaptchaLayout {
  children: React.ReactNode;
}

const ReCaptchaLayout: React.FC<ReCaptchaLayout> = ({ children }) => {
  return <RecaptchaContextProvider>{children}</RecaptchaContextProvider>;
};

export default ReCaptchaLayout;
