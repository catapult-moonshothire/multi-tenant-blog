// api/import-data/route.ts

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Received request to import data");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const subdomain = formData.get("subdomain") as string;
    const keepExistingData = formData.get("keepExistingData") === "true";

    console.log("Parsed form data:", { file, subdomain, keepExistingData });

    if (!file || !subdomain) {
      console.error("Error: No file uploaded or subdomain missing");
      return NextResponse.json(
        { error: "No file uploaded or subdomain missing" },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    const data = JSON.parse(fileContent);

    console.log(`Parsed file content, number of posts: ${data.length}`);

    let transactionActive = false;

    try {
      // Start a transaction
      console.log(`Starting transaction for subdomain: ${subdomain}`);
      await db.run(subdomain, "BEGIN TRANSACTION");
      transactionActive = true;

      if (!keepExistingData) {
        // Clear existing data for the specific subdomain
        console.log(`Deleting existing blog posts for subdomain: ${subdomain}`);
        await db.run(subdomain, "DELETE FROM blog_posts WHERE subdomain = ?", [
          subdomain,
        ]);
      }

      // Insert new data
      console.log("Inserting new blog posts...");
      for (const post of data) {
        console.log(`Inserting post with title: ${post.title}`);
        await db.run(
          subdomain,
          `INSERT OR REPLACE INTO blog_posts (title, slug, content, content_preview, is_draft, author, category, meta_title, meta_description, label, author_bio, reading_time, featured_image_url, status, images, created_at, updated_at, subdomain)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.title,
            post.slug,
            post.content,
            post.content_preview || null,
            post.is_draft ? 1 : 0,
            post.author,
            post.category || null,
            post.meta_title || null,
            post.meta_description || null,
            post.label || null,
            post.author_bio || null,
            post.reading_time || null,
            post.featured_image_url || null,
            post.status || null,
            JSON.stringify(post.images || []),
            post.created_at || new Date().toISOString(),
            post.updated_at || new Date().toISOString(),
            subdomain, // Ensure subdomain is included
          ]
        );
      }

      // Commit the transaction
      console.log("Committing transaction...");
      await db.run(subdomain, "COMMIT");
      transactionActive = false;

      revalidatePath("/admin");
      console.log("Data imported successfully for subdomain:", subdomain);
      return NextResponse.json({ message: "Data imported successfully" });
    } catch (error) {
      // Rollback the transaction if an error occurs and the transaction is still active
      if (transactionActive) {
        console.log("Rolling back transaction due to an error...");
        await db.run(subdomain, "ROLLBACK");
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to import data due to database error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import data" },
      { status: 500 }
    );
  }
}
