import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { subdomain, customDomain, name } = await request.json();

    const result = await db.run(
      `INSERT INTO blogs (subdomain, custom_domain, name) VALUES (?, ?, ?)`,
      [subdomain, customDomain, name]
    );

    return NextResponse.json(
      { id: result.lastID, subdomain, customDomain, name },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, customDomain } = await request.json();

    await db.run(`UPDATE blogs SET custom_domain = ? WHERE id = ?`, [
      customDomain,
      id,
    ]);

    return NextResponse.json({ message: "Custom domain updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update custom domain" },
      { status: 500 }
    );
  }
}
