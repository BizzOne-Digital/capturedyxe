import { connectDB } from "@/lib/db";
import { StoredUpload } from "@/models/StoredUpload";
export { safeImageSrc, IMAGE_PLACEHOLDER } from "@/lib/image-src";

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const UPLOAD_URL_PREFIX = "/api/uploads/";

export function isUploadFolder(v: unknown): v is UploadFolder {
  return typeof v === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(v);
}

/** Check the real file signature so a renamed file cannot sneak through. */
export function matchesMagicBytes(buf: Buffer, mime: string): boolean {
  switch (mime) {
    case "image/jpeg":
      return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    case "image/png":
      return buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif":
      return buf.length > 6 && ["GIF87a", "GIF89a"].includes(buf.subarray(0, 6).toString("ascii"));
    case "image/webp":
      return buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP";
    default:
      return false;
  }
}


function parseUploadUrl(url: string): { folder: string; filename: string } | null {
  if (!url.startsWith(UPLOAD_URL_PREFIX)) return null;
  const parts = url.slice(UPLOAD_URL_PREFIX.length).split("?")[0].split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return { folder: parts[0], filename: parts[1] };
}

/** Delete the stored binary behind an /api/uploads/ URL. Safe to call with any string. */
export async function deleteUploadByUrl(url: string | undefined | null): Promise<void> {
  if (!url) return;
  const parsed = parseUploadUrl(url);
  if (!parsed) return;
  try {
    await connectDB();
    await StoredUpload.deleteOne(parsed);
  } catch (e) {
    console.error("Failed to delete stored upload", e);
  }
}

/** Call after replacing/removing an image: deletes the old file if the URL changed. */
export async function deleteReplacedUpload(
  oldUrl: string | undefined | null,
  newUrl: string | undefined | null
): Promise<void> {
  if (oldUrl && oldUrl !== newUrl) await deleteUploadByUrl(oldUrl);
}
