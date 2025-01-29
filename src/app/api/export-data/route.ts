import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const posts = await db.query(subdomain, "SELECT * FROM blog_posts");
    return new NextResponse(JSON.stringify(posts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=${subdomain}-blog_data.json`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
