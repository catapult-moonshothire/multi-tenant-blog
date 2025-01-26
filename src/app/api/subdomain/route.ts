import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];

  if (subdomain === "localhost" || subdomain === "www") {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  const [blog] = await db.query("SELECT * FROM blogs WHERE subdomain = ?", [
    subdomain,
  ]);

  if (blog) {
    return NextResponse.rewrite(new URL(`/?blogId=${blog.id}`, request.url));
  }

  return NextResponse.rewrite(new URL("/404", request.url));
}
