import BlogListPage from "@/components/blog-posts";
import Header from "@/components/layout/header";
import MainContainer from "@/components/layout/main-container";
import db from "@/lib/db";
import { User } from "@/lib/types";

interface PageProps {
  params: { subdomain: string };
}

interface Blog {
  id: number;
  blogId: string;
  subdomain: string;
  custom_domain: string | null;
  name: string;
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = params;
  console.log("Subdomain:", subdomain);

  if (!subdomain) {
    console.error("Subdomain is undefined");
    return <div>Error: Subdomain is missing</div>;
  }

  try {
    // Fetch the blog and user details
    const [blogWithUser] = await db.query(
      undefined, // Use the main database
      `SELECT 
        blogs.*, 
        users.email, 
        users.firstName, 
        users.lastName, 
        users.bio, 
        users.socialLinks 
      FROM blogs 
      JOIN users ON blogs.blogId = users.blogId 
      WHERE blogs.subdomain = ? OR blogs.custom_domain = ?`,
      [subdomain, subdomain]
    );

    if (!blogWithUser) {
      console.error(
        `No blog found for subdomain or custom domain: ${subdomain}`
      );
      return <div>Blog not found for: {subdomain}</div>;
    }

    const { email, firstName, lastName, bio, socialLinks } = blogWithUser;

    console.log("User Details:", {
      email,
      firstName,
      lastName,
      bio,
      socialLinks,
    });

    const userData: User = {
      email,
      firstName,
      lastName,
      bio,
      socialLinks,
      subdomain,
    };

    return (
      <>
        <Header userData={userData} />
        <MainContainer>
          <BlogListPage subdomain={blogWithUser.subdomain} />
        </MainContainer>
      </>
    );
  } catch (error) {
    console.error("Error fetching blog or user details:", error);
    return (
      <div>
        An error occurred while fetching the blog or user details. Please try
        again later.
      </div>
    );
  }
}
