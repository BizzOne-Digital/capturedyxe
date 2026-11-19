import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Brand } from "@/models/Brand";
import { brandSchema } from "@/lib/brand-schema";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const items = await Brand.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const parsed = brandSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Please fill in the brand name." }, { status: 400 });
    }
    await connectDB();
    const slug = await uniqueSlug(Brand, parsed.data.name);
    const doc = await Brand.create({ ...parsed.data, slug });
    revalidatePath("/");
    revalidatePath("/brands");
    return NextResponse.json(doc.toObject());
  });
}
