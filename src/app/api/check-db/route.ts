import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if the blogs table exists
    const tables = await db.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'"
    );

    if (tables.length === 0) {
      return NextResponse.json(
        { error: "blogs table does not exist" },
        { status: 404 }
      );
    }

    // Check the structure of the blogs table
    const columns = await db.query("PRAGMA table_info(blogs)");

    // Check if a blog with ID 1 exists
    const [blog] = await db.query("SELECT * FROM blogs WHERE id = ?", [1]);

    return NextResponse.json({
      tableExists: true,
      columns: columns,
      blogExists: blog ? true : false,
      blog: blog,
    });
  } catch (error) {
    console.error("Error checking database:", error);
    return NextResponse.json(
      { error: "Failed to check database" },
      { status: 500 }
    );
  }
}
