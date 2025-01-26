import BlogListPage from "@/components/blog-posts";
import Header from "@/components/layout/header";
import MainContainer from "@/components/layout/main-container";
import db from "@/lib/db";

interface PageProps {
  params: { subdomain: string };
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = params;
  // console.log("Received subdomain:", subdomain);

  if (!subdomain) {
    console.error("Subdomain is undefined");
    return <div>Error: Subdomain is missing</div>;
  }

  try {
    // Fetch the blog to ensure it exists
    const [blog] = await db.query("SELECT * FROM blogs WHERE subdomain = ?", [
      subdomain,
    ]);
    // console.log("Database query result:", blog);

    if (!blog) {
      console.error(`No blog found for subdomain: ${subdomain}`);
      return <div>Blog not found for subdomain: {subdomain}</div>;
    }

    return (
      <>
        <Header />
        <MainContainer>
          <BlogListPage blogId={blog.id.toString()} subdomain={subdomain} />
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
