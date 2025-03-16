import BlogListPage from "@/components/blog-posts";
import Header from "@/components/layout/header";
import MainContainer from "@/components/layout/main-container";
import db from "@/lib/db";
import { capitalizeFirstLetter } from "@/lib/helper";
import { User } from "@/lib/types";
import { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { subdomain } = params;

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
      return {
        title: "Blog Not Found",
        description: "The requested blog does not exist.",
      };
    }

    const { firstName, lastName, bio, custom_domain } = blogWithUser;

    // Set the metadata
    return {
      title: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
        lastName
      )}${!custom_domain ? " | Inscribe" : ""}`,
      description: bio || "No bio available",
      openGraph: {
        title: `${firstName} ${lastName}`,
        description: bio || "No bio available",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${firstName} ${lastName}`,
        description: bio || "No bio available",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while fetching metadata.",
    };
  }
}

export default async function SubdomainPage({ params }: PageProps) {
  const { subdomain } = params;

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
        users.socialLinks,
        users.headline
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

    const { email, firstName, lastName, bio, socialLinks, headline } =
      blogWithUser;

    const userData: User = {
      email,
      firstName,
      lastName,
      bio,
      socialLinks,
      subdomain,
      headline,
    };

    console.log("userdata", userData);

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
