import db from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];
  console.log("Subdomain:", subdomain);
  console.log("Host:", host);

  if (subdomain === "localhost" || subdomain === "www") {
    return NextResponse.rewrite(new URL("/", request.url));
  }

  try {
    const [blog] = await db.query(
      "main",
      "SELECT * FROM blogs WHERE subdomain = ?",
      [subdomain]
    );

    if (blog) {
      return NextResponse.rewrite(
        new URL(`/?subdomain=${blog.subdomain}`, request.url)
      );
    }

    return NextResponse.rewrite(new URL("/404", request.url));
  } catch (error) {
    console.error("Error in subdomain route:", error);
    return NextResponse.rewrite(new URL("/500", request.url));
  }
}
