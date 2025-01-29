// import db from "@/lib/db";
// import { sign } from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// const FIXED_USERNAME = process.env.FIXED_USERNAME;
// const FIXED_PASSWORD = process.env.FIXED_PASSWORD;
// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// export async function POST(request: Request) {
//   const { username, password, blogId } = await request.json();

//   if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
//     // Verify that the blog exists
//     const [blog] = await db.query("SELECT * FROM blogs WHERE id = ?", [blogId]);
//     if (!blog) {
//       return NextResponse.json({ error: "Blog not found" }, { status: 404 });
//     }

//     const token = sign({ username, blogId }, JWT_SECRET, { expiresIn: "1h" });
//     (await cookies()).set("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 3600,
//       path: "/",
//     });

//     return NextResponse.json({ success: true, blogId });
//   }

//   return NextResponse.json({ success: false }, { status: 401 });
// }

//app/api/login/route.ts
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    // Assuming you have a 'users' table in the main database
    const [user] = await db.query(
      "main",
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = sign(
      { userId: user.id, subdomain: user.subdomain },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      subdomain: user.subdomain,
      username: user.username,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
