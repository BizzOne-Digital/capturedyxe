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
import { computeBookingCheckoutCents, isStripeConfigured } from "@/lib/stripe";
import {
  createBookingCheckoutSession,
  resumeBookingCheckoutSession,
} from "@/lib/stripe-booking";


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
    const payload: Record<string, unknown> = { ok: true, id: existing._id.toString() };
    if (existing.paymentStatus === "unpaid" && isStripeConfigured()) {
      try {
        const snap = existing.packageSnapshot;
        const resume = await resumeBookingCheckoutSession(
          existing._id.toString(),
          existing.email,
          existing.stripeCheckoutSessionId,
          {
            packageHelp: existing.packageHelp,
            packageSnapshot: snap
              ? {
                  name: snap.name,
                  priceCents: snap.priceCents,
                }
              : undefined,
            addOnSnapshots: (existing.addOnSnapshots ?? []).map(
              (a: { name: string; priceCents: number }) => ({
                name: a.name,
                priceCents: a.priceCents,
              })
            ),
          }
        );
        if (resume) {
          if (resume.sessionId !== existing.stripeCheckoutSessionId) {
            existing.stripeCheckoutSessionId = resume.sessionId;
            await existing.save();
          }
          payload.checkoutUrl = resume.url;
          payload.paymentRequired = true;
        }
      } catch (err) {
        console.error("Stripe checkout resume failed:", err);
      }
    }
    return NextResponse.json(payload);
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

  const amountDueCents = computeBookingCheckoutCents({
    packageHelp: parsed.data.packageHelp,
    packageSnapshot: packageSnapshot
      ? { name: packageSnapshot.name, priceCents: packageSnapshot.priceCents }
      : undefined,
    addOnSnapshots: addOnSnapshots.map((a) => ({
      name: a.name,
      priceCents: a.priceCents,
    })),
  });

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
    paymentStatus: amountDueCents ? "unpaid" : "not_required",
    amountDueCents: amountDueCents ?? undefined,
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

  let checkoutUrl: string | undefined;
  if (isStripeConfigured() && amountDueCents) {
    try {
      const checkout = await createBookingCheckoutSession(
        doc._id.toString(),
        parsed.data.email,
        {
          packageHelp: parsed.data.packageHelp,
          packageSnapshot: packageSnapshot
            ? { name: packageSnapshot.name, priceCents: packageSnapshot.priceCents }
            : undefined,
          addOnSnapshots: addOnSnapshots.map((a) => ({
            name: a.name,
            priceCents: a.priceCents,
          })),
        }
      );
      if (checkout) {
        doc.stripeCheckoutSessionId = checkout.sessionId;
        await doc.save();
        checkoutUrl = checkout.url;
      }
    } catch (err) {
      console.error("Stripe checkout session failed:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    id: doc._id.toString(),
    checkoutUrl,
    paymentRequired: Boolean(checkoutUrl),
  });
}
