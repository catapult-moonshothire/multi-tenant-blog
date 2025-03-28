import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { token, newPassword } = await request.json();

  try {
    // Find the token in the database
    const [resetToken] = await db.query(
      undefined,
      "SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > datetime('now')",
      [token]
    );

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await db.run(undefined, "UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      resetToken.email,
    ]);

    // Delete the used token
    await db.run(
      undefined,
      "DELETE FROM password_reset_tokens WHERE token = ?",
      [token]
    );

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred while resetting your password" },
      { status: 500 }
    );
  }
}
