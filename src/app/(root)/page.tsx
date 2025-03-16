import BlogListPage from "@/components/blog-posts";
import HomePageContent from "@/components/home-page-content";
import Header from "@/components/layout/header";
import MainContainer from "@/components/layout/main-container";
import { BASE_URL, MAIN_DOMAIN } from "@/lib/constants";
import db from "@/lib/db";
import { User } from "@/lib/types";
import { headers } from "next/headers";

export default async function RootPage() {
  const headersList = headers();
  const hostname = headersList.get("host") || "";
  const subdomain = hostname.split(".")[0];

  const userData: User = {
    email: "abhiav@moonshothire.com",
    firstName: "Abhinav",
    lastName: "Baldha",
    bio: "Product Manager",
    socialLinks: "https://www.linkedin.com/in/abhinavbaldha/",
  };

  // Handle root domain or default behavior
  if (hostname === "localhost:3000" || hostname === BASE_URL || MAIN_DOMAIN) {
    return (
      <>
        <main className="min-h-screen bg-muted antialiased w-full mx-auto scroll-smooth font-sans">
          <HomePageContent />
        </main>
      </>
    );
  }

  // Fetch and display subdomain-specific blog content
  try {
    const [tenantBlog] = await db.query(
      "main",
      "SELECT * FROM blogs WHERE subdomain = ? OR custom_domain = ?",
      [subdomain, hostname]
    );

    if (!tenantBlog) {
      return (
        <MainContainer>
          <Header userData={userData} />
          <div className="text-center text-lg font-semibold mt-10">
            Blog not found for this subdomain.
          </div>
        </MainContainer>
      );
    }

    return (
      <>
        <Header userData={userData} />
        <MainContainer>
          <BlogListPage subdomain={tenantBlog.subdomain} />
        </MainContainer>
      </>
    );
  } catch (error) {
    console.error(
      "RootPage - Error fetching tenant blog:",
      error,
      "Hostname:",
      hostname
    );
    return (
      <MainContainer>
        <Header userData={userData} />
        <div className="text-center text-lg font-semibold mt-10 text-red-500">
          Failed to load blog. Please try again later.
        </div>
      </MainContainer>
    );
  }
}
