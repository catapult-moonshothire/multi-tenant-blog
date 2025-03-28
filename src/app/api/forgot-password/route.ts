import db from "@/lib/db";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Check if the user exists
    const [user] = await db.query(
      undefined,
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a unique token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token in the database
    await db.run(
      undefined,
      "INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)",
      [email, token, expiresAt.toISOString()]
    );

    // Send the password reset email
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await resend.emails.send({
      from: "Abhinav Baldha <abhinav@moonshothire.com>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${user.firstName},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best,</p>
        <p>Abhinav Baldha</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset email sent, please check your inbox. The link is valid for 1 hour only.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
