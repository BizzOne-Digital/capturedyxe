import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { bookingSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { isPastEventDate, parseEventDateTime } from "@/lib/booking-date";
import { sendAdminNotification } from "@/lib/email";
import { BookingRequest } from "@/models/BookingRequest";
import { Package } from "@/models/Package";
import { AddOn } from "@/models/AddOn";


export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Booking requests are unavailable until MongoDB is configured." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = await checkRateLimit(`booking:${ip}`);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (isPastEventDate(parsed.data.eventDate)) {
    return NextResponse.json({ error: "Event date cannot be in the past." }, { status: 400 });
  }

  await connectDB();

  const existing = await BookingRequest.findOne({
    idempotencyKey: parsed.data.idempotencyKey,
  });
  if (existing) {
    return NextResponse.json({ ok: true, id: existing._id.toString() });
  }

  let packageSnapshot;
  if (parsed.data.packageId && !parsed.data.packageHelp) {
    const pkg = await Package.findById(parsed.data.packageId);
    if (pkg) {
      packageSnapshot = {
        packageId: pkg._id.toString(),
        name: pkg.name,
        priceCents: pkg.priceCents,
        durationHours: pkg.durationHours,
      };
    }
  }

  const addOnSnapshots = [];
  if (parsed.data.addOnIds?.length) {
    const addOns = await AddOn.find({ _id: { $in: parsed.data.addOnIds }, active: true });
    for (const a of addOns) {
      addOnSnapshots.push({
        addOnId: a._id.toString(),
        name: a.name,
        priceCents: a.priceCents,
      });
    }
  }

  const eventDate = parseEventDateTime(
    parsed.data.eventDate,
    parsed.data.eventTimeLocal
  );

  const doc = await BookingRequest.create({
    eventType: parsed.data.eventType,
    eventDate,
    eventTimeLocal: parsed.data.eventTimeLocal,
    venueName: parsed.data.venueName ?? "",
    venueAddress: parsed.data.venueAddress ?? "",
    venueNotConfirmed: parsed.data.venueNotConfirmed ?? false,
    guestCount: parsed.data.guestCount,
    packageHelp: parsed.data.packageHelp ?? false,
    packageSnapshot,
    addOnSnapshots,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    notes: parsed.data.notes ?? "",
    sourcePage: parsed.data.sourcePage ?? "/booking",
    idempotencyKey: parsed.data.idempotencyKey,
  });

  const sent = await sendAdminNotification(
    `New booking request — ${parsed.data.eventType}`,
    `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nDate: ${parsed.data.eventDate} ${parsed.data.eventTimeLocal}`
  );
  if (sent) {
    doc.notificationSent = true;
    await doc.save();
  }

  revalidatePath("/admin/bookings");
  return NextResponse.json({ ok: true, id: doc._id.toString() });
}
