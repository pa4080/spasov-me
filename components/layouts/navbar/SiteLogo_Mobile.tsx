import React from "react";

import SiteLogo from "@/components/layouts/logo/SiteLogo";

interface Props {
  className?: string;
}

const SiteLogo_Mobile: React.FC<Props> = () => {
  return (
    <SiteLogo
      autoBreak={false}
      className="emphasize_drop_shadow"
      style={{ width: "152px", height: "auto" }}
    />
  );
};

export default SiteLogo_Mobile;
