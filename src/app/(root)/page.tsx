import BlogListPage from "@/components/blog-posts";
import Header from "@/components/layout/header";
import MainContainer from "@/components/layout/main-container";
import db from "@/lib/db";
import { headers } from "next/headers";

export default async function RootPage() {
  const headersList = headers();
  const hostname = headersList.get("host") || "";
  const subdomain = hostname.split(".")[0];

  // Handle root domain or default behavior
  if (subdomain === "localhost" || subdomain === "blog") {
    return (
      <>
        <Header />
        <MainContainer>
          <div className="text-center text-lg font-semibold mt-10">
            Welcome to the Blog System. Please visit a subdomain!
          </div>
        </MainContainer>
      </>
    );
  }

  // Fetch and display subdomain-specific blog content
  try {
    const [tenantBlog] = await db.query(
      "main",
      "SELECT * FROM blogs WHERE subdomain = ?",
      [subdomain]
    );

    if (!tenantBlog) {
      return (
        <MainContainer>
          <Header />
          <div className="text-center text-lg font-semibold mt-10">
            Blog not found for this subdomain.
          </div>
        </MainContainer>
      );
    }

    return (
      <>
        <Header />
        <MainContainer>
          <BlogListPage subdomain={tenantBlog.subdomain} />
        </MainContainer>
      </>
    );
  } catch (error) {
    console.error("RootPage - Error fetching tenant blog:", error);
    return (
      <MainContainer>
        <Header />
        <div className="text-center text-lg font-semibold mt-10 text-red-500">
          Failed to load blog. Please try again later.
        </div>
      </MainContainer>
    );
  }
}
