// app/api/check-resources/route.ts
import { query } from "@/lib/db";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    // Check data
    let hasData = false;
    try {
      const results = await query(
        subdomain,
        "SELECT COUNT(*) as count FROM blog_posts"
      );
      hasData = results[0].count > 0;
    } catch (error) {
      console.error("Error checking data:", error);
    }

    // Check images
    let hasImages = false;
    try {
      const imageDir = path.join(process.cwd(), "public", "images", subdomain);
      await fs.access(imageDir);
      const files = await fs.readdir(imageDir);
      hasImages = files.length > 0;
    } catch (error) {
      // Directory doesn't exist or other error
      hasImages = false;
    }

    return NextResponse.json({ hasData, hasImages });
  } catch (error) {
    console.error("Error checking resources:", error);
    return NextResponse.json(
      { error: "Failed to check resources" },
      { status: 500 }
    );
  }
}
