import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

let error: string | null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  try {
    const posts = await db.query(
      "SELECT * FROM blog_posts WHERE blog_id = ? ORDER BY created_at DESC",
      [blogId]
    );
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  console.log("Received blogId:", blogId);

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, slug, content, content_preview, is_draft, ...rest } = body;

    console.log("Checking for blog with ID:", blogId);

    // Check if the blog exists
    const [blog] = await db.query("SELECT * FROM blogs WHERE id = ?", [blogId]);

    console.log("Query result:", blog);

    if (!blog) {
      // Check if the blogs table exists
      const tables = await db.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'"
      );
      if (tables.length === 0) {
        return NextResponse.json(
          { error: "blogs table does not exist" },
          { status: 500 }
        );
      }

      // If the table exists but the blog is not found, return a 404
      return NextResponse.json(
        { error: "Blog not found", blogId: blogId },
        { status: 404 }
      );
    }

    const result = await db.run(
      `INSERT INTO blog_posts (blog_id, title, slug, content, content_preview, is_draft, author, category, meta_title, meta_description, label, author_bio, reading_time, featured_image_url, status, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        blogId,
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
        rest.images,
      ]
    );
    return NextResponse.json({ id: result.lastID, ...body }, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post", details: (error as Error).message },
      { status: 500 }
    );
  }
}
