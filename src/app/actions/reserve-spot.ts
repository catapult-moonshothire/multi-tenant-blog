"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function reserveSpot(email: string) {
  try {
    // Send email to the user
    await resend.emails.send({
      from: "Abhinav Baldha <abhinav@moonshothire.com>",
      to: email,
      subject: "Thank You for Reserving Your Spot!",
      html: `
        <p>Hi there,</p>
        <p>Thank you for reserving your spot! You're now part of our early adopters program.</p>
        <p>As a reminder, this is <strong>free forever</strong> for early adopters, and no credit card is required.</p>
        <p>We'll keep you updated with the latest news and updates.</p>
        <p>Best,</p>
        <p>Abhinav Baldha</p>
      `,
    });

    // Send email to the admin
    await resend.emails.send({
      from: "Abhinav Baldha <abhinav@moonshothire.com>",
      to: "abhinav@moonshothire.com", // Replace with admin email
      subject: "New Spot Reservation",
      html: `
        <p>A new user has reserved their spot:</p>
        <p>Email: ${email}</p>
      `,
    });

    return {
      success: true,
      message:
        "Your spot has been reserved! Check your email for confirmation.",
    };
  } catch (error) {
    console.error("Error reserving spot:", error);
    return {
      success: false,
      message: "Failed to reserve your spot. Please try again.",
    };
  }
}
