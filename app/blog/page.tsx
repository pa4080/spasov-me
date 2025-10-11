import { type Metadata } from "next";

import { APP_NAME } from "@/app/_layout.constants";
import BlogPublic from "@/components/blog/public";

export const metadata: Metadata = {
  title: `${APP_NAME} Blog`,
};

const Blog: React.FC = () => {
  return (
    <div className="margin_vh_top mb-24 scroll-mt-40">
      <BlogPublic />
    </div>
  );
};

export default Blog;
