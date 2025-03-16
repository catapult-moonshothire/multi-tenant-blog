"use server";

import db from "@/lib/db"; // Import your database utility

export async function checkSubdomainAvailability(subdomain: string) {
  try {
    // Check if the subdomain is available
    const [existingBlog] = await db.query(
      undefined,
      "SELECT * FROM blogs WHERE subdomain = ?",
      [subdomain]
    );

    if (existingBlog) {
      return {
        success: false,
        message: "The entered name is already taken. Please try another one.",
      };
    } else {
      return { success: true, message: "Subdomain is available!" };
    }
  } catch (error) {
    console.error("Error checking subdomain availability:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
