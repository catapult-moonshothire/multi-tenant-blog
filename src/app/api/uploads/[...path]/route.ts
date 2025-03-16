import fs from "fs";
import mime from "mime"; // Install this with `npm install mime`
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  // Extract the requested file path
  const filePath = req.nextUrl.pathname.replace("/uploads/", "");
  const absolutePath = path.join(process.cwd(), "uploads", filePath);

  if (!fs.existsSync(absolutePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Get the file MIME type
  const mimeType = mime.getType(absolutePath) || "application/octet-stream";

  const fileBuffer = fs.readFileSync(absolutePath);
  return new NextResponse(fileBuffer, {
    headers: { "Content-Type": mimeType },
  });
}
