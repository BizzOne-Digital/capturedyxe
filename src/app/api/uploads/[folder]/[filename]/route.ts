import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";
import { isUploadFolder } from "@/lib/uploads";

export const runtime = "nodejs";

type Params = { params: Promise<{ folder: string; filename: string }> };

const SAFE_NAME = /^[A-Za-z0-9._-]+$/;

export async function GET(_req: Request, { params }: Params) {
  const { folder, filename } = await params;

  if (
    !isUploadFolder(folder) ||
    !SAFE_NAME.test(filename) ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return new Response("Not found", { status: 404 });
  }
  if (!isDatabaseConfigured()) return new Response("Not found", { status: 404 });

  await connectDB();
  const doc = await StoredUpload.findOne({ folder, filename }).select("mimeType data").lean<{
    mimeType: string;
    data: Buffer | { buffer: Uint8Array };
  }>();
  if (!doc) return new Response("Not found", { status: 404 });

  const raw = doc.data;
  const buf = Buffer.isBuffer(raw) ? raw : Buffer.from((raw as { buffer: Uint8Array }).buffer);

  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(buf.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
