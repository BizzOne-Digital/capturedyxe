import { getSiteUrl } from "@/lib/site-url";
import type Stripe from "stripe";
import {
  computeBookingCheckoutCents,
  getStripe,
  getStripeBookingPaymentMode,
  isStripeConfigured,
  type BookingAmountInput,
} from "@/lib/stripe";

function buildCheckoutLineItems(
  amountInput: BookingAmountInput,
  amountCents: number,
  isDeposit: boolean
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  if (isDeposit) {
    return [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: amountCents,
          product_data: {
            name: "Captured.YXE — booking deposit",
          },
        },
      },
    ];
  }

  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  if (amountInput.packageSnapshot) {
    items.push({
      quantity: 1,
      price_data: {
        currency: "cad",
        unit_amount: amountInput.packageSnapshot.priceCents,
        product_data: {
          name: amountInput.packageSnapshot.name,
        },
      },
    });
  }
  for (const addOn of amountInput.addOnSnapshots ?? []) {
    items.push({
      quantity: 1,
      price_data: {
        currency: "cad",
        unit_amount: addOn.priceCents,
        product_data: {
          name: addOn.name,
        },
      },
    });
  }

  const sum = items.reduce(
    (n, item) => n + (item.price_data?.unit_amount ?? 0) * (item.quantity ?? 1),
    0
  );
  if (items.length === 0 || sum !== amountCents) {
    return [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: amountCents,
          product_data: {
            name: `Captured.YXE — ${amountInput.packageSnapshot?.name ?? "package"}`,
          },
        },
      },
    ];
  }

  return items;
}

export async function createBookingCheckoutSession(
  bookingId: string,
  email: string,
  amountInput: BookingAmountInput
): Promise<{ url: string; sessionId: string; amountCents: number } | null> {
  if (!isStripeConfigured()) return null;

  const amountCents = computeBookingCheckoutCents(amountInput);
  if (!amountCents || amountCents < 50) return null;

  const mode = getStripeBookingPaymentMode();
  const isDeposit = mode === "deposit" || amountInput.packageHelp || !amountInput.packageSnapshot;

  const stripe = getStripe();
  const base = getSiteUrl();

  const line_items = buildCheckoutLineItems(amountInput, amountCents, isDeposit);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items,
    metadata: {
      bookingRequestId: bookingId,
      paymentKind: isDeposit ? "deposit" : "full",
    },
    success_url: `${base}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/booking?cancelled=1`,
  });

  if (!session.url) return null;

  return { url: session.url, sessionId: session.id, amountCents };
}

/** Re-open an existing Checkout session when possible; otherwise create a new one. */
export async function resumeBookingCheckoutSession(
  bookingId: string,
  email: string,
  existingSessionId: string | undefined,
  amountInput: BookingAmountInput
): Promise<{ url: string; sessionId: string } | null> {
  if (!isStripeConfigured()) return null;

  if (existingSessionId) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(existingSessionId);
      if (session.status === "open" && session.url) {
        return { url: session.url, sessionId: session.id };
      }
    } catch {
      // Missing Read permission on a restricted key, or expired session — create below.
    }
  }

  const created = await createBookingCheckoutSession(bookingId, email, amountInput);
  if (!created) return null;
  return { url: created.url, sessionId: created.sessionId };
}
