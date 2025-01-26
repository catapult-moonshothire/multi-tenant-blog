import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password, blogSubdomain, blogName } = await request.json();

  try {
    // Check if the user already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Create a new blog
    const blogResult = await db.run(
      "INSERT INTO blogs (subdomain, name) VALUES (?, ?)",
      [blogSubdomain, blogName]
    );
    const blogId = blogResult.lastID;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await db.run(
      "INSERT INTO users (username, password, blog_id) VALUES (?, ?, ?)",
      [username, hashedPassword, blogId]
    );

    return NextResponse.json(
      { success: true, message: "User and blog created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
