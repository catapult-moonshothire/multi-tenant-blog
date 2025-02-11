// app/api/get-subdomain/route.ts
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hostname = searchParams.get("hostname");

  if (!hostname) {
    return NextResponse.json(
      { error: "Hostname is required" },
      { status: 400 }
    );
  }

  try {
    // Check if this is a custom domain
    const [customDomainBlog] = await db.query(
      "main",
      "SELECT subdomain FROM blogs WHERE custom_domain = ?",
      [hostname]
    );

    if (customDomainBlog) {
      return NextResponse.json({ subdomain: customDomainBlog.subdomain });
    }

    // Check if it's a subdomain
    const MAIN_DOMAIN = process.env.MAIN_DOMAIN || "xxyy.in";
    const potentialSubdomain = hostname.replace(`.${MAIN_DOMAIN}`, "");
    if (potentialSubdomain && potentialSubdomain !== "www") {
      const [subdomainBlog] = await db.query(
        "main",
        "SELECT subdomain FROM blogs WHERE subdomain = ?",
        [potentialSubdomain]
      );
      if (subdomainBlog) {
        return NextResponse.json({ subdomain: potentialSubdomain });
      }
    }

    // If no match is found
    return NextResponse.json({ subdomain: null });
  } catch (error) {
    console.error("Error fetching subdomain:", error);
    return NextResponse.json(
      { error: "Failed to fetch subdomain" },
      { status: 500 }
    );
  }
}
