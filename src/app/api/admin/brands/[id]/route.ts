import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Brand } from "@/models/Brand";
import { brandSchema } from "@/lib/brand-schema";
import { deleteReplacedUpload, deleteUploadByUrl } from "@/lib/uploads";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const parsed = brandSchema.partial().safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    await connectDB();
    const before = await Brand.findById(id).select("logoUrl photos").lean<{ logoUrl?: string; photos?: string[] }>();
    const doc = await Brand.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (parsed.data.logoUrl !== undefined) {
      await deleteReplacedUpload(before?.logoUrl, parsed.data.logoUrl);
    }
    if (parsed.data.photos !== undefined) {
      const keep = new Set(parsed.data.photos);
      for (const url of before?.photos ?? []) {
        if (!keep.has(url)) await deleteUploadByUrl(url);
      }
    }
    revalidatePath("/");
    revalidatePath("/brands");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    await connectDB();
    const doc = await Brand.findByIdAndDelete(id);
    if (doc) {
      await deleteUploadByUrl(doc.logoUrl);
      for (const url of (doc.photos ?? []) as string[]) await deleteUploadByUrl(url);
    }
    revalidatePath("/");
    revalidatePath("/brands");
    return NextResponse.json({ ok: true });
  });
}
