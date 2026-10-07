import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Service } from "@/models/Service";


const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()).optional(),
  audience: z.string().optional(),
  imageUrl: z.string().optional(),
  imageAlt: z.string().optional(),
  order: z.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    await connectDB();
    const items = await Service.find().sort({ order: 1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }
    const body = await req.json().catch(() => null);
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    await connectDB();
    const doc = await Service.create(parsed.data);
    revalidatePath("/services");
    return NextResponse.json(doc.toObject());
  });
}
