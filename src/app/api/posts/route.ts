import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const posts = await db.query(
      subdomain,
      "SELECT * FROM blog_posts ORDER BY created_at DESC"
    );
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { title, slug, content, content_preview, is_draft, ...rest } = body;

    const result = await db.run(
      subdomain,
      `INSERT INTO blog_posts (title, slug, content, content_preview, is_draft, author, category, meta_title, meta_description, label, author_bio, reading_time, featured_image_url, status, images, subdomain)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        content,
        content_preview,
        is_draft ? 1 : 0,
        rest.author,
        rest.category,
        rest.meta_title,
        rest.meta_description,
        rest.label,
        rest.author_bio,
        rest.reading_time,
        rest.featured_image_url,
        rest.status,
        JSON.stringify(rest.images || []),
        subdomain,
      ]
    );
    return NextResponse.json(
      { id: result.lastID, ...body, subdomain },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: (error as Error).message },
      { status: 500 }
    );
  }
}
