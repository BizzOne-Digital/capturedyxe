import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Service } from "@/models/Service";
import { deleteReplacedUpload, deleteUploadByUrl } from "@/lib/uploads";

const serviceSchema = z.object({
  title: z.string().trim().min(1).optional(),
  summary: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  features: z.array(z.string()).optional(),
  audience: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { id } = await params;
    const parsed = serviceSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    }
    await connectDB();
    const before = await Service.findById(id).select("imageUrl").lean<{ imageUrl?: string }>();
    const doc = await Service.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (parsed.data.imageUrl !== undefined) {
      await deleteReplacedUpload(before?.imageUrl, parsed.data.imageUrl);
    }
    revalidatePath("/services");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const { id } = await params;
    await connectDB();
    const doc = await Service.findByIdAndDelete(id);
    await deleteUploadByUrl(doc?.imageUrl);
    revalidatePath("/services");
    return NextResponse.json({ ok: true });
  });
}
