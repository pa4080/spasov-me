import React from "react";

import BlogAdmin from "@/components/blog/admin";

export const dynamic = "force-dynamic";

const Blog: React.FC = () => {
  return <BlogAdmin className="margin_vh_top margin_vh_bottom scroll-mt-40" />;
};

export default Blog;
