import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token");

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = verify(token.value, JWT_SECRET) as {
      username: string;
      subdomain: string;
    };
    return NextResponse.json({
      authenticated: true,
      username: decoded.username,
      subdomain: decoded.subdomain,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
