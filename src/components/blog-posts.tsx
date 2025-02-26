import db from "@/lib/db";
import { isNewPost } from "@/lib/helper";
import type { Metadata } from "next";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  content_preview: string;
  created_at: string;
  updated_at: string;
  slug: string;
  is_draft: number;
  label: string;
}

interface BlogPostsProps {
  subdomain: string;
}

export const metadata: Metadata = {
  title: "My Blog",
  description: "A collection of my blog posts.",
};

export default async function BlogListPage({ subdomain }: BlogPostsProps) {
  // Fetch the custom domain for the given subdomain
  const customDomain = await db.getCustomDomain(subdomain);

  console.log("custom domain from blog list page", customDomain);

  // Fetch blog posts
  const blogPosts: BlogPost[] = await db.query(
    subdomain,
    "SELECT * FROM blog_posts WHERE is_draft = 0 ORDER BY created_at DESC"
  );

  // If no posts are available, return a message instead of the spinner
  if (blogPosts.length === 0) {
    return (
      <main className="prose mx-auto flex-1 w-full max-w-4xl relative z-10">
        <p>No blog posts available at the moment.</p>
      </main>
    );
  }

  return (
    <main className="prose mx-auto flex-1 w-full max-w-4xl relative z-10">
      {blogPosts.map((post) => (
        <div key={post.id}>
          <h2 className="flex -mt-1 !leading-none items-center text-lg sm:text-xl">
            <Link
              href={
                customDomain
                  ? `/blog/${post.slug}` // Clean URL for custom domains
                  : `/${subdomain}/blog/${post.slug}` // Subdomain URL for subdomains
              }
              prefetch
              className="mt-0.5 font-semibold"
            >
              {post.title}
            </Link>
            {post?.label === "new" && isNewPost(post?.created_at) && (
              <span className="inline-flex items-center rounded-full bg-[#ff6b6b] px-1.5 py-0.5 text-xs font-medium text-white uppercase ml-3 mt-0.5">
                New
              </span>
            )}
            <span className="ml-3 text-sm text-primary/50 font-normal">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </h2>
        </div>
      ))}
    </main>
  );
}
