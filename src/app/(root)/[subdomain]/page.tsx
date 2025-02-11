import BlogListPage from "@/components/blog-posts";
import Header from "@/components/layout/header";
import MainContainer from "@/components/layout/main-container";
import db from "@/lib/db";

interface PageProps {
  params: { subdomain: string };
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = params;
  console.log("Subdomain:", subdomain);

  if (!subdomain) {
    console.error("Subdomain is undefined");
    return <div>Error: Subdomain is missing</div>;
  }

  try {
    // Fetch the blog to ensure it exists
    const [blog] = await db.query(
      undefined,
      "SELECT * FROM blogs WHERE subdomain = ? OR custom_domain = ?",
      [subdomain, subdomain]
    );

    if (!blog) {
      console.error(
        `No blog found for subdomain or custom domain: ${subdomain}`
      );
      return <div>Blog not found for: {subdomain}</div>;
    }

    const actualSubdomain = blog.subdomain;

    return (
      <>
        <Header />
        <MainContainer>
          <BlogListPage subdomain={actualSubdomain} />
        </MainContainer>
      </>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div>
        An error occurred while fetching the blog. Please try again later.
      </div>
    );
  }
}
