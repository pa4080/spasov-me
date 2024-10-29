import React from "react";

import SiteLogo from "@/components/layouts/logo/SiteLogo";
import PagesPublic from "@/components/pages/public";
import { msgs } from "@/messages";

const Home: React.FC = async () => {
  const t = msgs("Home");

  return (
    <>
      <SiteLogo
        className="w-full margin_vh_top"
        greeting_ln1={t("greeting_ln1")}
        greeting_ln2={t("greeting_ln2")}
      />
      <PagesPublic className="margin_vh_middle margin_vh_bottom" />
    </>
  );
};

export default Home;
