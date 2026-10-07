import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { FAQ } from "@/models/FAQ";


const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.enum([
    "booking",
    "booth-experience",
    "prints-keepsakes",
    "event-planning",
  ]),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const items = await FAQ.find().sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const parsed = faqSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    await connectDB();
    const doc = await FAQ.create(parsed.data);
    revalidatePath("/faq");
    return NextResponse.json(doc.toObject());
  });
}
