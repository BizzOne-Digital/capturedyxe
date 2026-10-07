import { NextResponse } from "next/server";
import { getPublishedTestimonials } from "@/lib/data/public";

export async function GET() {
  const items = await getPublishedTestimonials();
  return NextResponse.json({ items });
}
