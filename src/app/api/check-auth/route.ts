// api/check-auth/route.ts

import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  const cookieStore = await cookies();
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
      phoneNumber: string;
      location: string;
      headline: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      tiktok?: string;
      youtube?: string;
      extraLink?: string;
    };

    return NextResponse.json({
      authenticated: true,
      userId: decoded.userId,
      subdomain: decoded.subdomain,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      bio: decoded.bio,
      phoneNumber: decoded.phoneNumber,
      location: decoded.location,
      headline: decoded.headline,
      twitter: decoded.twitter,
      linkedin: decoded.linkedin,
      instagram: decoded.instagram,
      tiktok: decoded.tiktok,
      youtube: decoded.youtube,
      extraLink: decoded.extraLink,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
