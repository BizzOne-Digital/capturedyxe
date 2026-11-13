import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { TeamMember } from "@/models/TeamMember";
import { deleteReplacedUpload, deleteUploadByUrl } from "@/lib/uploads";

const schema = z.object({
  name: z.string().trim().min(1).optional(),
  role: z.string().trim().min(1).optional(),
  biography: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    await connectDB();
    const before = await TeamMember.findById(id).select("imageUrl").lean<{ imageUrl?: string }>();
    const doc = await TeamMember.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (parsed.data.imageUrl !== undefined) {
      await deleteReplacedUpload(before?.imageUrl, parsed.data.imageUrl);
    }
    revalidatePath("/our-team");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    await connectDB();
    const doc = await TeamMember.findByIdAndDelete(id);
    await deleteUploadByUrl(doc?.imageUrl);
    revalidatePath("/our-team");
    return NextResponse.json({ ok: true });
  });
}
