import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get("subdomain");
  if (!subdomain)
    return NextResponse.json({ error: "Subdomain required" }, { status: 400 });

  try {
    const categories = await db.query(
      subdomain,
      "SELECT * FROM categories ORDER BY name"
    );
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const subdomain = req.nextUrl.searchParams.get("subdomain");
  if (!subdomain)
    return NextResponse.json({ error: "Subdomain required" }, { status: 400 });

  const { name } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Name required" }, { status: 400 });

  try {
    const result = await db.run(
      subdomain,
      "INSERT INTO categories (name, subdomain) VALUES (?, ?)",
      [name.trim(), subdomain]
    );
    return NextResponse.json(
      { id: result?.lastID, name, subdomain },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Category already exists" },
      { status: 400 }
    );
  }
}
