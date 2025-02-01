import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const blogs = await db.query("main", "SELECT * FROM blogs");
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subdomain, name, custom_domain } = await request.json();
    const result = await db.run(
      "main",
      "INSERT INTO blogs (subdomain, name, custom_domain) VALUES (?, ?, ?)",
      [subdomain, name, custom_domain]
    );
    return NextResponse.json(
      { id: result?.lastID, subdomain, name, custom_domain },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
