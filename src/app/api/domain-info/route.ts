// app/api/domain-info/route.ts
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const subdomain = url.searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain is required" },
        { status: 400 }
      );
    }

    // Get custom domain and cloudflare data for the subdomain
    const [result] = await db.query(
      undefined,
      "SELECT custom_domain, cloudflare_data FROM blogs WHERE subdomain = ?",
      [subdomain]
    );

    if (!result) {
      return NextResponse.json(
        { error: "Subdomain not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subdomain,
      customDomain: result.custom_domain,
      cloudflareData: result.cloudflare_data,
    });
  } catch (error) {
    console.error("Error fetching domain info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
