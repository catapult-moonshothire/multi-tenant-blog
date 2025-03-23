import fs from "fs/promises";
import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

const DB_DIR =
  process.env.NODE_ENV === "production"
    ? "/db"
    : path.join(process.cwd(), "db");
const MAIN_DB_PATH = path.join(DB_DIR, "main.sqlite");

async function openDb(subdomain?: string) {
  const dbPath = subdomain
    ? path.join(DB_DIR, `${subdomain}.sqlite`)
    : MAIN_DB_PATH;

  await fs.mkdir(DB_DIR, { recursive: true });

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  if (!subdomain) {
    // This is the main database
    await db.exec(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blogId TEXT UNIQUE NOT NULL,
        subdomain TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        custom_domain TEXT UNIQUE,
        cloudflare_data TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_subdomain ON blogs(subdomain);
      CREATE INDEX IF NOT EXISTS idx_custom_domain ON blogs(custom_domain);

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blogId TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        subdomain TEXT UNIQUE NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check and add missing columns to the users table
    const usersColumns = await db.all("PRAGMA table_info(users);");
    const usersColumnsToAdd = [
      { name: "headline", type: "TEXT" },
      { name: "bio", type: "TEXT" },
      { name: "location", type: "TEXT" },
      { name: "socialLinks", type: "TEXT" },
      { name: "phoneNumber", type: "TEXT" },
    ];

    for (const column of usersColumnsToAdd) {
      const columnExists = usersColumns.some((col) => col.name === column.name);
      if (!columnExists) {
        await db.exec(
          `ALTER TABLE users ADD COLUMN ${column.name} ${column.type};`
        );
        console.log(`Added column '${column.name}' to 'users' table.`);
      }
    }

    // Check and add missing columns to the blogs table
    const blogsColumns = await db.all("PRAGMA table_info(blogs);");
    const blogsColumnsToAdd = [
      { name: "cloudflare_data", type: "TEXT" }, // Add cloudflare_data if it doesn't exist
    ];

    for (const column of blogsColumnsToAdd) {
      const columnExists = blogsColumns.some((col) => col.name === column.name);
      if (!columnExists) {
        await db.exec(
          `ALTER TABLE blogs ADD COLUMN ${column.name} ${column.type};`
        );
        console.log(`Added column '${column.name}' to 'blogs' table.`);
      } else {
        console.log(`Column '${column.name}' already exists in 'blogs' table.`);
      }
    }
  } else {
    // This is a subdomain-specific database
    await db.exec(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        content TEXT NOT NULL,
        content_preview TEXT,
        is_draft INTEGER,
        author TEXT NOT NULL,
        category TEXT,
        meta_title TEXT,
        meta_description TEXT,
        label TEXT,
        author_bio TEXT,
        reading_time INTEGER,
        featured_image_url TEXT,
        status TEXT,
        images TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT,
        published_at TEXT,
        subdomain TEXT NOT NULL,
        UNIQUE(slug, subdomain)
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subdomain TEXT NOT NULL,
        UNIQUE(name, subdomain)
      );

      CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subdomain TEXT NOT NULL,
        is_primary INTEGER DEFAULT 0,
        UNIQUE(name, subdomain)
      );
    `);

    // Check if the `published_at` column exists, and add it if it doesn't
    const columnInfo = await db.all("PRAGMA table_info(blog_posts);");

    const hasPublishedAtColumn = columnInfo.some(
      (column) => column.name === "published_at"
    );

    if (!hasPublishedAtColumn) {
      await db.exec(`
        ALTER TABLE blog_posts ADD COLUMN published_at TEXT;
      `);
      console.log(
        `Added 'published_at' column to 'blog_posts' table in ${dbPath}`
      );

      // Set default value for existing rows
      await db.exec(`
        UPDATE blog_posts SET published_at = datetime('now') WHERE published_at IS NULL;
      `);
      console.log(`Set default value for 'published_at' column in ${dbPath}`);
    }
  }

  return db;
}

export async function query(
  subdomain: string | undefined,
  sql: string,
  params: any[] = []
) {
  try {
    const db = await openDb(subdomain);
    return await db.all(sql, params);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function run(
  subdomain: string | undefined,
  sql: string,
  params: any[] = []
) {
  try {
    const db = await openDb(subdomain);
    return await db.run(sql, params);
  } catch (error) {
    console.error("Database run error:", error);
  }
}

export async function getSubdomainFromCustomDomain(
  customDomain: string
): Promise<string | null> {
  try {
    const [result] = await query(
      undefined,
      "SELECT subdomain FROM blogs WHERE custom_domain = ?",
      [customDomain]
    );
    return result ? result.subdomain : null;
  } catch (error) {
    console.error("Error getting subdomain from custom domain:", error);
    return null;
  }
}

export async function getCustomDomain(
  subdomain: string
): Promise<string | null> {
  try {
    const [result] = await query(
      undefined,
      "SELECT custom_domain FROM blogs WHERE subdomain = ?",
      [subdomain]
    );
    return result ? result.custom_domain : null;
  } catch (error) {
    console.error("Error fetching custom domain:", error);
    return null;
  }
}

export default { query, run, getSubdomainFromCustomDomain, getCustomDomain };
