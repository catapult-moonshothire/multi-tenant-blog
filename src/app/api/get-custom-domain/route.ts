import { query } from "@/lib/db"; // Adjust the import path as needed
import { NextResponse } from "next/server";

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
    const [result] = await query(
      undefined,
      "SELECT custom_domain FROM blogs WHERE subdomain = ?",
      [subdomain]
    );

    return NextResponse.json(
      { customDomain: result ? result.custom_domain : null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching custom domain:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom domain" },
      { status: 500 }
    );
  }
}
