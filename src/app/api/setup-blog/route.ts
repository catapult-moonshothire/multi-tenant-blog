import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");
  const subdomain = searchParams.get("subdomain");
  const name = searchParams.get("name");

  if (!subdomain || !name) {
    return NextResponse.json(
      { error: "Subdomain and name are required" },
      { status: 400 }
    );
  }

  try {
    // Check if the blogs table exists
    const tables = await db.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'"
    );

    if (tables.length === 0) {
      // Create the blogs table
      await db.run(`
        CREATE TABLE blogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          subdomain TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("blogs table created");
    }

    // Check if the blog with the given subdomain already exists
    const [existingBlog] = await db.query(
      "SELECT * FROM blogs WHERE subdomain = ?",
      [subdomain]
    );

    if (existingBlog) {
      return NextResponse.json(
        {
          message: "Blog with this subdomain already exists",
          blog: existingBlog,
        },
        { status: 409 }
      );
    }

    // Create a new blog
    const result = await db.run(
      "INSERT INTO blogs (subdomain, name) VALUES (?, ?)",
      [subdomain, name]
    );

    const newBlogId = result.lastID;
    const [newBlog] = await db.query("SELECT * FROM blogs WHERE id = ?", [
      newBlogId,
    ]);

    console.log(`Blog ${newBlogId} created`);
    return NextResponse.json(
      { message: "Blog created successfully", blog: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error setting up blog:", error);
    return NextResponse.json(
      { error: "Failed to set up blog" },
      { status: 500 }
    );
  }
}
