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
      userId: number;
      subdomain: string;
      firstName: string;
      lastName: string;
      bio: string;
      socialLinks: string;
      phoneNumber: string;
      location: string;
      headline: string;
    };

    return NextResponse.json({
      authenticated: true,
      userId: decoded.userId,
      subdomain: decoded.subdomain,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      bio: decoded.bio,
      socialLinks: decoded.socialLinks,
      phoneNumber: decoded.phoneNumber,
      location: decoded.location,
      headline: decoded.headline,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
