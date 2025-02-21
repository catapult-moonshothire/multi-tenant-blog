import db from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const {
    email,
    password,
    firstName,
    lastName,
    bio,
    socialLinks,
    phoneNumber,
    blogSubdomain,
  } = await request.json();

  try {
    // Check if the user already exists
    const [existingUser] = await db.query(
      undefined,
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Check if the subdomain is already taken
    const [existingBlog] = await db.query(
      undefined,
      "SELECT * FROM blogs WHERE subdomain = ?",
      [blogSubdomain]
    );
    if (existingBlog) {
      return NextResponse.json(
        { error: "Blog subdomain already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique blogId
    const blogId = uuidv4();

    // Create a new blog
    await db.run(
      undefined,
      "INSERT INTO blogs (blogId, subdomain, name) VALUES (?, ?, ?)",
      [blogId, blogSubdomain, `${firstName}'s Blog`] // Add a default blog name
    );

    // Create a new user
    await db.run(
      undefined,
      "INSERT INTO users (blogId, email, password, firstName, lastName, bio, socialLinks, phoneNumber, subdomain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        blogId,
        email,
        hashedPassword,
        firstName,
        lastName,
        bio,
        socialLinks,
        phoneNumber,
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
