import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { GalleryItem } from "@/models/GalleryItem";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    await connectDB();
    const doc = await GalleryItem.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/gallery");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    await connectDB();
    const doc = await GalleryItem.findById(id);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (doc.cloudinaryPublicId && isCloudinaryConfigured()) {
      try {
        const cld = getCloudinary();
        await cld.uploader.destroy(doc.cloudinaryPublicId);
      } catch (e) {
        console.error("Cloudinary delete failed", e);
      }
    }
    await doc.deleteOne();
    revalidatePath("/gallery");
    return NextResponse.json({ ok: true });
  });
}
