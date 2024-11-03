import React from "react";

import PortfolioAdmin from "@/components/portfolio/admin";

export const dynamic = "force-dynamic";

const Portfolio: React.FC = () => {
  return <PortfolioAdmin className="margin_vh_top margin_vh_bottom scroll-mt-40" />;
};

export default Portfolio;
