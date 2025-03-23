const fs = require("fs/promises");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const DB_DIR =
  process.env.NODE_ENV === "production"
    ? "/db"
    : path.join(process.cwd(), "db");
const MAIN_DB_PATH = path.join(DB_DIR, "main.sqlite");

// Define the default socialLinks object
const DEFAULT_SOCIAL_LINKS = JSON.stringify({
  twitter: "",
  linkedin: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  extra: "",
});

async function openDb() {
  await fs.mkdir(DB_DIR, { recursive: true });

  const db = await open({
    filename: MAIN_DB_PATH,
    driver: sqlite3.Database,
  });

  return db;
}

async function updateSocialLinks() {
  const db = await openDb();

  try {
    // Fetch all rows from the blogs table
    const rows = await db.all("SELECT id, socialLinks FROM blogs");

    for (const row of rows) {
      let socialLinks = row.socialLinks;

      // If socialLinks is null, an empty string, or invalid JSON, replace it with the default object
      if (!socialLinks || typeof socialLinks !== "string") {
        socialLinks = DEFAULT_SOCIAL_LINKS;
      } else {
        try {
          // Try to parse socialLinks to check if it's valid JSON
          JSON.parse(socialLinks);
        } catch (error) {
          // If parsing fails, replace it with the default object
          socialLinks = DEFAULT_SOCIAL_LINKS;
        }
      }

      // Update the row with the new socialLinks value
      await db.run("UPDATE blogs SET socialLinks = ? WHERE id = ?", [
        socialLinks,
        row.id,
      ]);

      console.log(`Updated blog with ID ${row.id}`);
    }

    console.log("All blogs have been updated successfully.");
  } catch (error) {
    console.error("Error updating socialLinks:", error);
  } finally {
    await db.close();
  }
}

// Run the script
updateSocialLinks();
