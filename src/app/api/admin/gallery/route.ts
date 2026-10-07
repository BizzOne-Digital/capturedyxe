import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { GalleryItem } from "@/models/GalleryItem";


const schema = z.object({
  imageUrl: z.string().min(1),
  cloudinaryPublicId: z.string().optional(),
  alt: z.string().min(1),
  caption: z.string().optional(),
  category: z.string().optional(),
  designation: z.enum(["event", "inspiration"]).optional(),
  order: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const items = await GalleryItem.find().sort({ order: 1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    await connectDB();
    const doc = await GalleryItem.create(parsed.data);
    revalidatePath("/gallery");
    return NextResponse.json(doc.toObject());
  });
}
