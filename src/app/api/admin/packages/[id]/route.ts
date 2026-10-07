import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { Package } from "@/models/Package";
import { AddOn } from "@/models/AddOn";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const body = await req.json().catch(() => null);
    await connectDB();
    if (body?.resource === "addon") {
      const doc = await AddOn.findByIdAndUpdate(id, { $set: body.data }, { new: true });
      if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
      revalidatePath("/pricing");
      return NextResponse.json(doc.toObject());
    }
    const doc = await Package.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidatePath("/pricing");
    return NextResponse.json(doc.toObject());
  });
}

export async function DELETE(req: Request, { params }: Params) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    const { id } = await params;
    const url = new URL(req.url);
    const resource = url.searchParams.get("resource");
    await connectDB();
    if (resource === "addon") {
      await AddOn.findByIdAndDelete(id);
    } else {
      await Package.findByIdAndDelete(id);
    }
    revalidatePath("/pricing");
    return NextResponse.json({ ok: true });
  });
}
