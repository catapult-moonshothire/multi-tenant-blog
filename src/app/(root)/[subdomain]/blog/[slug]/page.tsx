import MainContainer from "@/components/layout/main-container";
import db from "@/lib/db";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  content_preview: string;
  created_at: string;
  slug: string;
  is_draft: number;
  meta_title: string;
  meta_description: string;
}

interface PageProps {
  params: { subdomain: string; slug: string };
}

export const revalidate = 3600 * 2; // Revalidate every 2 hours

export async function generateStaticParams() {
  // This function needs to be updated to work with the new database structure
  // For now, we'll return an empty array
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { subdomain, slug } = params;

  const [blogPost] = await db.query(
    subdomain,
    "SELECT * FROM blog_posts WHERE slug = ?",
    [slug]
  );

  if (!blogPost || blogPost.is_draft === 1) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: blogPost?.meta_title || blogPost.title,
    description: blogPost?.meta_description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { subdomain, slug } = params;

  const [blogPost] = await db.query(
    subdomain,
    "SELECT * FROM blog_posts WHERE slug = ?",
    [slug]
  );

  if (!blogPost || blogPost.is_draft === 1) {
    notFound();
  }

  // Function to replace img tags with Next.js Image components
  const replaceImagesWithNextImage = (content: string) => {
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    return content.replace(imgRegex, (match, src) => {
      return `<Image src="${src}" alt="Blog post image" width={800} height={600} layout="responsive" />`;
    });
  };

  const processedContent = replaceImagesWithNextImage(blogPost.content);

  return (
    <MainContainer>
      <main className="prose mx-auto flex-1 w-full max-w-3xl fobol py-4 sm:p-8 relative z-10">
        <header className="my-8">
          {new Date(blogPost.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          by <Link href="/">Blog Author</Link>
        </header>
        <h1 className="text-4xl font-extrabold">{blogPost.title}</h1>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </main>
    </MainContainer>
  );
}

export const dynamic = "force-dynamic";
