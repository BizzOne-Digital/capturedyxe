import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { StoredUpload } from "@/models/StoredUpload";
import {
  ALLOWED_MIME,
  MAX_UPLOAD_BYTES,
  isUploadFolder,
  matchesMagicBytes,
  deleteUploadByUrl,
} from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
    }

    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ success: false, error: "Invalid upload" }, { status: 400 });
    }

    const folder = form.get("folder");
    const file = form.get("file");

    if (!isUploadFolder(folder)) {
      return NextResponse.json({ success: false, error: "Invalid folder" }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file received" }, { status: 400 });
    }

    const ext = ALLOWED_MIME[file.type];
    if (!ext) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP or GIF images are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ success: false, error: "Image is larger than 8 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length === 0 || !matchesMagicBytes(buffer, file.type)) {
      return NextResponse.json({ success: false, error: "File is not a valid image" }, { status: 400 });
    }

    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
    await connectDB();
    await StoredUpload.create({
      folder,
      filename,
      mimeType: file.type,
      size: buffer.length,
      data: buffer,
    });

    return NextResponse.json({
      success: true,
      url: `/api/uploads/${folder}/${filename}`,
      filename,
      size: buffer.length,
      folder,
    });
  });
}

export async function DELETE(req: Request) {
  return withAdmin(async () => {
    const body = await req.json().catch(() => null);
    const url = typeof body?.url === "string" ? body.url : "";
    if (!url.startsWith("/api/uploads/")) {
      return NextResponse.json({ success: false, error: "Invalid URL" }, { status: 400 });
    }
    await deleteUploadByUrl(url);
    return NextResponse.json({ success: true });
  });
}
