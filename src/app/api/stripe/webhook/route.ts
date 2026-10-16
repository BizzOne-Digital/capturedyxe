import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { BookingRequest } from "@/models/BookingRequest";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingRequestId;

    if (bookingId && isDatabaseConfigured()) {
      await connectDB();
      const amountPaid = session.amount_total ?? undefined;

      await BookingRequest.findByIdAndUpdate(bookingId, {
        $set: {
          paymentStatus: "paid",
          amountPaidCents: amountPaid,
          stripeCheckoutSessionId: session.id,
          paidAt: new Date(),
          status: "awaiting_confirmation",
        },
      });
      revalidatePath("/admin/bookings");
    }
  }

  return NextResponse.json({ received: true });
}
