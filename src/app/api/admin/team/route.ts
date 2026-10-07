import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { TeamMember } from "@/models/TeamMember";


const schema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  biography: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().optional(),
  visible: z.boolean().optional(),
});

export async function GET() {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const items = await TeamMember.find().sort({ order: 1 }).lean();
    return NextResponse.json({ items });
  });
}

export async function POST(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    await connectDB();
    const doc = await TeamMember.create(parsed.data);
    revalidatePath("/our-team");
    return NextResponse.json(doc.toObject());
  });
}
