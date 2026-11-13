import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Offer } from "@/models/Offer";
import { uniqueSlug } from "@/lib/slug";

const schema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().optional(),
  description: z.string().trim().min(1),
  percentageOff: z.number().min(0).max(100).optional(),
  eligibility: z.string().optional(),
  notes: z.string().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  visible: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const items = await Offer.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please fill in the title and description." }, { status: 400 });
    }
    await connectDB();
    const { startsAt, endsAt, ...rest } = parsed.data;
    const slug = await uniqueSlug(Offer, rest.title, rest.slug);
    const doc = await Offer.create({
      ...rest,
      slug,
      ...(startsAt ? { startsAt: new Date(startsAt) } : {}),
      ...(endsAt ? { endsAt: new Date(endsAt) } : {}),
    });
    revalidatePath("/");
    return NextResponse.json(doc.toObject());
  });
}

export async function PATCH(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const body = await req.json().catch(() => null);
    const parsed = schema.partial().extend({ id: z.string() }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
    const { id, startsAt, endsAt, slug, ...rest } = parsed.data;
    void slug;
    const set: Record<string, unknown> = { ...rest };
    const unset: Record<string, 1> = {};
    if (startsAt !== undefined) {
      if (startsAt) set.startsAt = new Date(startsAt);
      else unset.startsAt = 1;
    }
    if (endsAt !== undefined) {
      if (endsAt) set.endsAt = new Date(endsAt);
      else unset.endsAt = 1;
    }
    await connectDB();
    const doc = await Offer.findByIdAndUpdate(
      id,
      { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) },
      { new: true }
    );
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/");
    return NextResponse.json(doc.toObject());
  });
}
