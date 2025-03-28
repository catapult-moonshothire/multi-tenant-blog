import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;

  // Validate the subdomain
  if (!subdomain || typeof subdomain !== "string") {
    return NextResponse.json(
      { error: "Subdomain is required and must be a string" },
      { status: 400 }
    );
  }

  try {
    // Fetch user data from the database based on the subdomain
    const [user] = await db.query(
      undefined,
      "SELECT * FROM users WHERE subdomain = ?",
      [subdomain]
    );

    // If no user is found, return a 404 error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data as a JSON response
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
