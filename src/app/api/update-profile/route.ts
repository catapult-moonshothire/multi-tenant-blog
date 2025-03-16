import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const {
    subdomain,
    firstName,
    lastName,
    bio,
    socialLinks,
    phoneNumber,
    headline,
    location,
  } = await request.json();

  try {
    // Update the user's profile in the database
    await db.run(
      undefined,
      "UPDATE users SET firstName = ?, lastName = ?, bio = ?, socialLinks = ?, phoneNumber = ?, headline = ?, location = ? WHERE subdomain = ?",
      [
        firstName,
        lastName,
        bio,
        JSON.stringify(socialLinks),
        phoneNumber,
        headline,
        location,
        subdomain,
      ]
    );

    // Fetch the updated user data
    const [updatedUser] = await db.query(
      undefined,
      "SELECT * FROM users WHERE subdomain = ?",
      [subdomain]
    );

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
