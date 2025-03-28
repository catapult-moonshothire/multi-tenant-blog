import { readdir, readFile } from "fs/promises";
import JSZip from "jszip";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const imagesDir = path.join(process.cwd(), "public", "images", subdomain);
    const files = await readdir(imagesDir);

    const zip = new JSZip();

    for (const file of files) {
      const content = await readFile(path.join(imagesDir, file));
      zip.file(file, content);
    }

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipContent, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${subdomain}-blog-images.zip"`,
      },
    });
  } catch (error) {
    console.error("Error exporting images:", error);
    return NextResponse.json(
      { error: "Failed to export images" },
      { status: 500 }
    );
  }
}
