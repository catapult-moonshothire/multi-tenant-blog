import { createReadStream, existsSync } from "fs";
import mime from "mime-types";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    // Extract file path from URL
    const url = new URL(req.url);
    const filePath = url.pathname.replace("/api/uploads/", "");

    // Resolve absolute path
    const absolutePath = path.join(process.cwd(), "uploads", filePath);

    // Check if file exists
    if (!existsSync(absolutePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Determine content type
    const contentType = mime.lookup(absolutePath) || "application/octet-stream";

    // Create response stream
    const fileStream = createReadStream(absolutePath);
    const readableWebStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    const response = new NextResponse(readableWebStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
