import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Offer } from "@/models/Offer";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    await connectDB();
    await Offer.findByIdAndDelete(id);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  });
}
