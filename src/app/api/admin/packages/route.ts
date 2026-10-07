import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Package } from "@/models/Package";
import { AddOn } from "@/models/AddOn";


const inclusionSchema = z.object({
  label: z.string(),
  needsClientConfirmation: z.boolean().optional(),
  publiclyVisible: z.boolean().optional(),
});

const packageSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  tier: z.enum(["standard", "signature", "elite"]),
  priceCents: z.number().int().min(0),
  durationHours: z.number().min(1),
  inclusions: z.array(inclusionSchema).optional(),
  confirmationNotes: z.string().optional(),
  shortDescription: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
  showPricePublicly: z.boolean().optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const packages = await Package.find().sort({ order: 1 }).lean();
    const addOns = await AddOn.find().sort({ order: 1 }).lean();
    return NextResponse.json({ packages, addOns });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const body = await req.json().catch(() => null);
    if (body?.type === "addon") {
      const addOnSchema = z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        priceCents: z.number().int().min(0),
        description: z.string().optional(),
        needsClientConfirmation: z.boolean().optional(),
        active: z.boolean().optional(),
        showPricePublicly: z.boolean().optional(),
        order: z.number().optional(),
      });
      const parsed = addOnSchema.safeParse(body.data);
      if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      await connectDB();
      const doc = await AddOn.create(parsed.data);
      revalidatePath("/pricing");
      return NextResponse.json(doc.toObject());
    }
    const parsed = packageSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    await connectDB();
    const doc = await Package.create(parsed.data);
    revalidatePath("/pricing");
    return NextResponse.json(doc.toObject());
  });
}
