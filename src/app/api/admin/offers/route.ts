import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Offer } from "@/models/Offer";


const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  percentageOff: z.number().optional(),
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
    const items = await Offer.find().lean();
    return NextResponse.json({ items });
  });
}

export async function PATCH(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const body = await req.json().catch(() => null);
    const parsed = schema.partial().extend({ id: z.string() }).safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    const { id, ...data } = parsed.data;
    if (data.startsAt) (data as { startsAt?: Date }).startsAt = new Date(data.startsAt);
    if (data.endsAt) (data as { endsAt?: Date }).endsAt = new Date(data.endsAt);
    await connectDB();
    const doc = await Offer.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/");
    return NextResponse.json(doc.toObject());
  });
}
