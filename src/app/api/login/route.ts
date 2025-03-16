import db from "@/lib/db";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // Fetch user from the database
    const [user] = await db.query(
      "main",
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log("User from database:", user); // Debugging

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log("Password match:", passwordMatch); // Debugging

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        subdomain: user.subdomain,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        socialLinks: user.socialLinks,
        phoneNumber: user.phoneNumber,
        headline: user.headline,
        location: user.location,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set cookie
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    console.log("Cookie set successfully"); // Debugging

    // Return all user data
    return NextResponse.json({
      success: true,
      email: user.email,
      subdomain: user.subdomain,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      socialLinks: (user.socialLinks && JSON.parse(user.socialLinks)) || [],
      phoneNumber: user.phoneNumber,
      headline: user.headline,
      location: user.location,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
