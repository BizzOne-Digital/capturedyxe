import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { inquirySchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendAdminNotification } from "@/lib/email";
import { Inquiry } from "@/models/Inquiry";


export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Enquiries are unavailable until MongoDB is configured." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = await checkRateLimit(`inquiry:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  await connectDB();

  const existing = await Inquiry.findOne({ idempotencyKey: parsed.data.idempotencyKey });
  if (existing) {
    return NextResponse.json({ ok: true, id: existing._id.toString() });
  }

  const eventDate = parsed.data.eventDate
    ? new Date(parsed.data.eventDate)
    : undefined;

  const doc = await Inquiry.create({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? "",
    eventType: parsed.data.eventType,
    eventDate,
    message: parsed.data.message,
    sourcePage: parsed.data.sourcePage ?? "/contact",
    idempotencyKey: parsed.data.idempotencyKey,
  });

  const sent = await sendAdminNotification(
    `New enquiry from ${parsed.data.name}`,
    `Email: ${parsed.data.email}\nEvent: ${parsed.data.eventType}\n\n${parsed.data.message}`
  );
  if (sent) {
    doc.notificationSent = true;
    await doc.save();
  }

  revalidatePath("/admin/inquiries");
  return NextResponse.json({ ok: true, id: doc._id.toString() });
}
