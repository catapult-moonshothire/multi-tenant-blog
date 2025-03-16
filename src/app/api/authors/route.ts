import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get("subdomain");
  if (!subdomain)
    return NextResponse.json({ error: "Subdomain required" }, { status: 400 });

  try {
    const authors = await db.query(
      subdomain,
      "SELECT * FROM authors ORDER BY is_primary DESC, name"
    );
    return NextResponse.json(authors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get("subdomain");
  if (!subdomain)
    return NextResponse.json({ error: "Subdomain required" }, { status: 400 });

  const { name, isPrimary } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });

  try {
    if (isPrimary) {
      await db.run(
        subdomain,
        "UPDATE authors SET is_primary = 0 WHERE subdomain = ?",
        [subdomain]
      );
    }

    const result = await db.run(
      subdomain,
      "INSERT INTO authors (name, subdomain, is_primary) VALUES (?, ?, ?)",
      [name.trim(), subdomain, isPrimary ? 1 : 0]
    );
    return NextResponse.json(
      {
        id: result?.lastID,
        name,
        subdomain,
        is_primary: isPrimary,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Author already exists" },
      { status: 400 }
    );
  }
}
