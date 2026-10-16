import { getSiteUrl } from "@/lib/site-url";
import {
  computeBookingCheckoutCents,
  getStripe,
  getStripeBookingPaymentMode,
  isStripeConfigured,
  type BookingAmountInput,
} from "@/lib/stripe";

export async function createBookingCheckoutSession(
  bookingId: string,
  email: string,
  amountInput: BookingAmountInput
): Promise<{ url: string; sessionId: string; amountCents: number } | null> {
  if (!isStripeConfigured()) return null;

  const amountCents = computeBookingCheckoutCents(amountInput);
  if (!amountCents || amountCents < 50) return null;

  const mode = getStripeBookingPaymentMode();
  const pkgName = amountInput.packageSnapshot?.name;
  const isDeposit = mode === "deposit" || amountInput.packageHelp || !amountInput.packageSnapshot;

  const productName = isDeposit
    ? "Captured.YXE — booking deposit"
    : `Captured.YXE — ${pkgName ?? "package"}`;

  const description = isDeposit
    ? "Refundable per your booking agreement. Remaining balance confirmed with our team."
    : "Package booking payment (CAD, before tax). Final quote confirmed with our team.";

  const stripe = getStripe();
  const base = getSiteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: amountCents,
          product_data: {
            name: productName,
            description,
          },
        },
      },
    ],
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
