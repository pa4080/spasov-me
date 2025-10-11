/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import { notFound } from "next/navigation";
import React from "react";
import { type Metadata, type ResolvingMetadata } from "next";

import { APP_NAME, BASE_URL, META_DESCRIPTION, OG_IMAGE } from "@/app/_layout.constants";
import { getPost, getPosts } from "@/components/blog/_blog.actions";
import BlogPublicPost from "@/components/blog/public/Post";
import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { Route } from "@/routes";

import { aiGenerateKeywords } from "./aiGenerateKeywords";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(
  { params, searchParams: _searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost({ slug: slug, public: true, hyphen: false });

  if (!post) {
    return {};
  }

  // optionally access and extend (rather than replace) parent metadata
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images ?? [];

  const title = post.title + ` | ${APP_NAME} Blog`;
  const coverImage = post.html.attachment?.metadata.html.fileUrl ?? OG_IMAGE;

  const descriptionArr = post.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  const metaDescription = descriptionArr[0] ?? META_DESCRIPTION;
  const keywords = (await aiGenerateKeywords({ postDescription: metaDescription }))
    .split(",")
    .map((keyword: string) => keyword.trim());

  console.log(metaDescription, keywords);

  return {
    title: title,
    description: metaDescription,
    alternates: {
      canonical: `${BASE_URL}${Route.public.BLOG.uri}/${slug}`,
    },
    openGraph: {
      title,
      description: metaDescription,
      images: [
        ...(coverImage
          ? [
              {
                url: coverImage,
                width: 1200,
                height: 630,
                alt: title,
              },
            ]
          : []),
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image", // or "summary", "app", "player"
      title,
      description: metaDescription,
      images: [coverImage],
    },
    keywords,
  };
}

export async function generateStaticParams() {
  const posts = await getPosts({
    hyphen: false,
    public: true,
  });

  return posts?.map((p) => ({ slug: p.slug })) ?? [];
}

const Post: React.FC<Props> = async ({ params }) => {
  const slug = (await params).slug;
  const postId_Slug = slug;

  const data: {
    postsHyphenated?: PostData[] | null;
    fileList: FileListItem[] | null;
    iconList: FileListItem[] | null;
    tags: TagData[] | null;
    iconsMap: IconsMap;
  } = await Promise.all([
    getPosts({ hyphen: true, public: true }),
    getFileList({ prefix: files_prefix }),
    getFileList({ prefix: icons_prefix }),
    getTags(),
    getIconsMap(),
  ]).then(([postsHyphenated, fileList, iconList, tags, iconsMap]) => ({
    postsHyphenated,
    fileList,
    iconList,
    tags,
    iconsMap,
  }));

  const post = data.postsHyphenated?.find(
    (post) => post._id === postId_Slug || post.slug === postId_Slug
  );

  if (!post) {
    notFound();
  }

  delete data.postsHyphenated;

  const title = post.title + ` | ${APP_NAME} Blog`;
  const coverImage = post.html.attachment?.metadata.html.fileUrl ?? OG_IMAGE;

  const descriptionArr = post.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  // ✅ JSON-LD structured data,
  // https://developers.google.com/search/docs/appearance/structured-data/article
  const metaDescription = descriptionArr[0] ?? META_DESCRIPTION;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDescription,
    image: [coverImage ?? OG_IMAGE],
    author: {
      "@type": "Organization",
      name: APP_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    datePublished: post.dateFrom,
    dateModified: post.dateFrom,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}${Route.public.BLOG.uri}/${slug}`,
    },
  };

  return (
    <div className="mt-2 sa:mt-6 mb-24 scroll-mt-40">
      <BlogPublicPost post={post} {...data} />

      {/* ✅ Inject JSON-LD */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
    </div>
  );
};

export default Post;
