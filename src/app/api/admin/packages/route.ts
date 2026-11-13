import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Package } from "@/models/Package";
import { AddOn } from "@/models/AddOn";
import { uniqueSlug } from "@/lib/slug";

const inclusionSchema = z.object({
  label: z.string(),
  needsClientConfirmation: z.boolean().optional(),
  publiclyVisible: z.boolean().optional(),
});

const packageSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().optional(),
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

const addOnSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().optional(),
  priceCents: z.number().int().min(0),
  description: z.string().optional(),
  needsClientConfirmation: z.boolean().optional(),
  active: z.boolean().optional(),
  showPricePublicly: z.boolean().optional(),
  order: z.number().optional(),
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
    const invalid = NextResponse.json(
      { error: "Please fill in the name, price and the other required fields." },
      { status: 400 }
    );
    if (body?.type === "addon") {
      const parsed = addOnSchema.safeParse(body.data);
      if (!parsed.success) return invalid;
      await connectDB();
      const slug = await uniqueSlug(AddOn, parsed.data.name, parsed.data.slug);
      const doc = await AddOn.create({ ...parsed.data, slug });
      revalidatePath("/pricing");
      return NextResponse.json(doc.toObject());
    }
    const parsed = packageSchema.safeParse(body);
    if (!parsed.success) return invalid;
    await connectDB();
    const slug = await uniqueSlug(Package, parsed.data.name, parsed.data.slug);
    const doc = await Package.create({ ...parsed.data, slug });
    revalidatePath("/pricing");
    return NextResponse.json(doc.toObject());
  });
}
