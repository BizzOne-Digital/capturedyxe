import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { SiteSettings } from "@/models/SiteSettings";


const patchSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(5).optional(),
  phoneTel: z.string().min(5).optional(),
  serviceArea: z.string().max(1000).optional(),
  instagramUrl: z.string().max(500).optional(),
  facebookUrl: z.string().max(500).optional(),
  logoUrl: z.string().max(500).optional(),
  tagline: z.string().max(200).optional(),
  startingPriceCents: z.number().int().min(0).optional(),
  showPublicPackagePrices: z.boolean().optional(),
  siteName: z.string().max(120).optional(),
  defaultSeoTitle: z.string().max(200).optional(),
  defaultSeoDescription: z.string().max(500).optional(),
  headline: z.string().max(300).optional(),
  subheadline: z.string().max(500).optional(),
  heroImageUrl: z.string().max(500).optional(),
  ctaPrimaryLabel: z.string().max(80).optional(),
  ctaSecondaryLabel: z.string().max(80).optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await connectDB();
    let doc = await SiteSettings.findOne({ singletonKey: "main" });
    if (!doc) doc = await SiteSettings.create({});
    return NextResponse.json(doc.toObject());
  });
}

export async function PATCH(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const body = await req.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    await connectDB();
    const doc = await SiteSettings.findOneAndUpdate(
      { singletonKey: "main" },
      { $set: parsed.data },
      { new: true, upsert: true }
    );
    revalidatePath("/", "layout");
    return NextResponse.json(doc?.toObject());
  });
}
