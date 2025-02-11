import db from "@/lib/db"; // Ensure correct SQLite connection
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await db.query(
      "main",
      "SELECT subdomain, custom_domain FROM blogs"
    );

    // Transform into an object for fast lookup
    const domainMappings = results.reduce<Record<string, string>>(
      (acc, row) => {
        if (row.custom_domain) acc[row.custom_domain] = row.subdomain;
        return acc;
      },
      {}
    );

    return NextResponse.json({ success: true, data: domainMappings });
  } catch (error) {
    console.error("Error fetching subdomain mappings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subdomain mappings" },
      { status: 500 }
    );
  }
}
