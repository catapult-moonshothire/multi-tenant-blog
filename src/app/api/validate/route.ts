import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, blogSubdomain } = await request.json();

  try {
    // Check if the email already exists
    const [existingUser] = await db.query(
      undefined,
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Check if the blog subdomain already exists
    const [existingBlog] = await db.query(
      undefined,
      "SELECT * FROM blogs WHERE subdomain = ?",
      [blogSubdomain]
    );
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog subdomain already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email and blog handle are available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "An error occurred during validation" },
      { status: 500 }
    );
  }
}
