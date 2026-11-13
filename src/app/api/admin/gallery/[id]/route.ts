import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { GalleryItem } from "@/models/GalleryItem";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { deleteReplacedUpload, deleteUploadByUrl } from "@/lib/uploads";

const schema = z.object({
  imageUrl: z.string().min(1).optional(),
  alt: z.string().trim().min(1).optional(),
  caption: z.string().optional(),
  category: z.string().optional(),
  designation: z.enum(["event", "inspiration"]).optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    await connectDB();
    const before = await GalleryItem.findById(id).select("imageUrl").lean<{ imageUrl?: string }>();
    const doc = await GalleryItem.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (parsed.data.imageUrl !== undefined) {
      await deleteReplacedUpload(before?.imageUrl, parsed.data.imageUrl);
    }
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
        await getCloudinary().uploader.destroy(doc.cloudinaryPublicId);
      } catch (e) {
        console.error("Cloudinary delete failed", e);
      }
    }
    await deleteUploadByUrl(doc.imageUrl);
    await doc.deleteOne();
    revalidatePath("/gallery");
    return NextResponse.json({ ok: true });
  });
}
