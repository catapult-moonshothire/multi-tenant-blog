// app/api/upload-image/route.ts
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let filename = searchParams.get("filename");
  const subdomain = searchParams.get("subdomain");

  if (!filename || !subdomain) {
    return NextResponse.json(
      { error: "Filename and subdomain are required" },
      { status: 400 }
    );
  }

  // Remove any path information from the filename
  filename = path.basename(filename);

  const file = await request.blob();

  try {
    // Define the subdomain-specific image directory
    const imagesDir = path.join(process.cwd(), "public", "images", subdomain);
    await mkdir(imagesDir, { recursive: true });

    // Save the file
    await writeFile(
      path.join(imagesDir, filename),
      Buffer.from(await file.arrayBuffer())
    );

    // Return the direct URL to the image
    const imageUrl = `/images/${subdomain}/${filename}`;

    return NextResponse.json({
      url: imageUrl,
    });
  } catch (error) {
    console.error("Error saving image:", error);
    return NextResponse.json(
      { error: "Failed to save image" },
      { status: 500 }
    );
  }
}
