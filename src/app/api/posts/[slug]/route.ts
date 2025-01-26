import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  try {
    const [post] = await db.query(
      "SELECT * FROM blog_posts WHERE blog_id = ? AND slug = ?",
      [blogId, slug]
    );
    if (post) {
      return NextResponse.json(post);
    } else {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const { title, content, content_preview, is_draft, ...rest } = body;
    await db.run(
      `UPDATE blog_posts 
       SET title = ?, content = ?, content_preview = ?, is_draft = ?, 
           author = ?, category = ?, meta_title = ?, meta_description = ?, 
           label = ?, author_bio = ?, reading_time = ?, 
           featured_image_url = ?, status = ?, images = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE blog_id = ? AND slug = ?`,
      [
        title,
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
        blogId,
        slug,
      ]
    );
    return NextResponse.json({ slug, ...body });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID is required" }, { status: 400 });
  }

  try {
    await db.run("DELETE FROM blog_posts WHERE blog_id = ? AND slug = ?", [
      blogId,
      slug,
    ]);
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
