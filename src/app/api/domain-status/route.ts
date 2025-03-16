// app/api/domain-status/route.ts
import db from "@/lib/db";
import { NextResponse } from "next/server";

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const zoneId = url.searchParams.get("zoneId");

    if (!zoneId) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 }
      );
    }

    // Check zone status in Cloudflare
    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const cloudflareData = await cloudflareResponse.json();

    if (!cloudflareResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch domain status from Cloudflare",
          details: cloudflareData,
        },
        { status: 500 }
      );
    }

    // Update our database with the latest status
    if (cloudflareData.result) {
      const domainName = cloudflareData.result.name;

      // Update the cloudflare_data in the database
      await db.query(
        undefined,
        "UPDATE blogs SET cloudflare_data = ?, updated_at = CURRENT_TIMESTAMP WHERE custom_domain = ?",
        [JSON.stringify(cloudflareData.result), domainName]
      );
    }

    return NextResponse.json(cloudflareData);
  } catch (error) {
    console.error("Error checking domain status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
