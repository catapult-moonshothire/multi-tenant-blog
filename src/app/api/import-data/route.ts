import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const subdomain = formData.get("subdomain") as string;
    const keepExistingData = formData.get("keepExistingData") === "true";

    if (!file || !subdomain) {
      return NextResponse.json(
        { error: "No file uploaded or subdomain missing" },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    const data = JSON.parse(fileContent);

    let transactionActive = false;

    try {
      // Start a transaction
      await db.run(subdomain, "BEGIN TRANSACTION");
      transactionActive = true;

      if (!keepExistingData) {
        // Clear existing data for the specific subdomain
        await db.run(subdomain, "DELETE FROM blog_posts WHERE subdomain = ?", [
          subdomain,
        ]);
      }

      // Insert new data
      for (const post of data) {
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
      await db.run(subdomain, "COMMIT");
      transactionActive = false;
      revalidatePath("/admin");
      return NextResponse.json({ message: "Data imported successfully" });
    } catch (error) {
      // Rollback the transaction if an error occurs and the transaction is still active
      if (transactionActive) {
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
