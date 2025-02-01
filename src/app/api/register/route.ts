import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password, blogSubdomain, blogName } = await request.json();

  try {
    // Check if the user already exists
    const [existingUser] = await db.query(
      "main",
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Check if the subdomain is already taken
    const [existingBlog] = await db.query(
      "main",
      "SELECT * FROM blogs WHERE subdomain = ?",
      [blogSubdomain]
    );
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog subdomain already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new blog
    await db.run("main", "INSERT INTO blogs (subdomain, name) VALUES (?, ?)", [
      blogSubdomain,
      blogName,
    ]);

    // Create a new user
    await db.run(
      "main",
      "INSERT INTO users (username, password, subdomain) VALUES (?, ?, ?)",
      [username, hashedPassword, blogSubdomain]
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
