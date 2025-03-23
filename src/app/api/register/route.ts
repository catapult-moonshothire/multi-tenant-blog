// api/register/route.ts

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const {
    firstName,
    lastName,
    blogSubdomain,
    email,
    password,
    headline,
    bio,
    location,
    socialLinks,
  } = await request.json();

  try {
    // Parse socialLinks safely
    let parsedSocialLinks;
    try {
      parsedSocialLinks = socialLinks ? JSON.parse(socialLinks) : {};
    } catch (error) {
      // If parsing fails, initialize it as an empty object
      parsedSocialLinks = {};
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique blogId
    const blogId = uuidv4();

    // Create a new blog
    await db.run(
      undefined,
      "INSERT INTO blogs (blogId, subdomain, name) VALUES (?, ?, ?)",
      [blogId, blogSubdomain, `${firstName}'s Blog`]
    );

    // Create a new user
    await db.run(
      undefined,
      "INSERT INTO users (blogId, email, password, firstName, lastName, headline, bio, location, socialLinks, subdomain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        blogId,
        email,
        hashedPassword,
        firstName,
        lastName,
        headline || null,
        bio || null,
        location || null,
        JSON.stringify(parsedSocialLinks), // Store as a valid JSON string
        blogSubdomain,
      ]
    );

    // Send welcome email to the user
    await resend.emails.send({
      from: "Abhinav Baldha <abhinav@moonshothire.com>",
      to: email,
      subject: "Welcome to Our Platform!",
      html: `
        <p>Hi ${firstName},</p>
        <p>Welcome to our platform! We're excited to have you on board.</p>
        <p>Your blog subdomain is: <strong>${blogSubdomain}</strong></p>
        <p>Feel free to explore and start creating content.</p>
        <p>Best,</p>
        <p>Abhinav Baldha</p>
      `,
    });

    // Send notification email to the admin
    await resend.emails.send({
      from: "Abhinav Baldha <abhinav@moonshothire.com>",
      to: "abhinav@moonshothire.com", // Replace with admin email
      subject: "New User Registration",
      html: `
        <p>A new user has registered:</p>
        <p>Name: ${firstName} ${lastName}</p>
        <p>Email: ${email}</p>
        <p>Blog Subdomain: ${blogSubdomain}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "User and blog created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
