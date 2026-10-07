import { NextResponse } from "next/server";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { withAdmin } from "@/lib/admin/guard-api";
import { BookingRequest } from "@/models/BookingRequest";


export async function GET(req: Request) {
  return withAdmin(async () => {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    await connectDB();
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const q = status ? { status } : {};
    const items = await BookingRequest.find(q).sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ items });
  });
}
