import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Testimonial } from "@/models/Testimonial";
import { deleteReplacedUpload, deleteUploadByUrl } from "@/lib/uploads";

const schema = z.object({
  reviewerName: z.string().trim().min(1).optional(),
  quote: z.string().trim().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  eventCategory: z.string().optional(),
  imageUrl: z.string().optional(),
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
    const before = await Testimonial.findById(id).select("imageUrl").lean<{ imageUrl?: string }>();
    const doc = await Testimonial.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (parsed.data.imageUrl !== undefined) {
      await deleteReplacedUpload(before?.imageUrl, parsed.data.imageUrl);
    }
    revalidatePath("/testimonials");
    revalidatePath("/");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    await connectDB();
    const doc = await Testimonial.findByIdAndDelete(id);
    await deleteUploadByUrl(doc?.imageUrl);
    revalidatePath("/testimonials");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  });
}
