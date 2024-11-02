import React from "react";

import AboutAdmin from "@/components/about/admin";

export const dynamic = "force-dynamic";

const About: React.FC = () => {
  return <AboutAdmin className="margin_vh_top margin_vh_bottom scroll-mt-40" />;
};

export default About;
