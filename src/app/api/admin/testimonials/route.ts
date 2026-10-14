import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Testimonial } from "@/models/Testimonial";


const schema = z.object({
  reviewerName: z.string().min(1),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
  eventCategory: z.string().optional(),
  imageUrl: z.string().optional(),
  eventDate: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const items = await Testimonial.find().sort({ order: 1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    await connectDB();
    const data = { ...parsed.data };
    if (data.eventDate) data.eventDate = new Date(data.eventDate) as unknown as string;
    const doc = await Testimonial.create(data);
    revalidatePath("/");
    return NextResponse.json(doc.toObject());
  });
}
