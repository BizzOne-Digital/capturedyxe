import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Package } from "@/models/Package";
import { AddOn } from "@/models/AddOn";
import { deleteReplacedUpload, deleteUploadByUrl } from "@/lib/uploads";

const inclusionSchema = z.object({
  label: z.string(),
  needsClientConfirmation: z.boolean().optional(),
  publiclyVisible: z.boolean().optional(),
});

const packagePatch = z.object({
  name: z.string().trim().min(1).optional(),
  tier: z.enum(["standard", "signature", "elite"]).optional(),
  priceCents: z.number().int().min(0).optional(),
  durationHours: z.number().min(1).optional(),
  inclusions: z.array(inclusionSchema).optional(),
  confirmationNotes: z.string().optional(),
  shortDescription: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
  showPricePublicly: z.boolean().optional(),
});

const addOnPatch = z.object({
  name: z.string().trim().min(1).optional(),
  priceCents: z.number().int().min(0).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  needsClientConfirmation: z.boolean().optional(),
  active: z.boolean().optional(),
  showPricePublicly: z.boolean().optional(),
  order: z.number().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const body = await req.json().catch(() => null);
    await connectDB();
    if (body?.resource === "addon") {
      const parsed = addOnPatch.safeParse(body.data);
      if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
      const before = await AddOn.findById(id).select("imageUrl").lean<{ imageUrl?: string }>();
      const doc = await AddOn.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
      if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (parsed.data.imageUrl !== undefined) await deleteReplacedUpload(before?.imageUrl, parsed.data.imageUrl);
      revalidatePath("/pricing");
      return NextResponse.json(doc.toObject());
    }
    const parsed = packagePatch.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    const doc = await Package.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/pricing");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const resource = new URL(req.url).searchParams.get("resource");
    await connectDB();
    if (resource === "addon") {
      const removed = await AddOn.findByIdAndDelete(id);
      await deleteUploadByUrl(removed?.imageUrl);
    } else {
      await Package.findByIdAndDelete(id);
    }
    revalidatePath("/pricing");
    return NextResponse.json({ ok: true });
  });
}
