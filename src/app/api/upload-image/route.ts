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

  // Sanitize the filename
  filename = path.basename(filename);

  const file = await request.blob();

  try {
    // Define the correct uploads directory (outside `public/`)
    const uploadsDir = path.join(process.cwd(), "uploads", "images", subdomain);
    await mkdir(uploadsDir, { recursive: true });

    // Save the file
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // Return the API URL where the image can be accessed
    const imageUrl = `/uploads/images/${subdomain}/${filename}`;

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
