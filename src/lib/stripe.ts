import Stripe from "stripe";

/**
 * Restricted secret keys: enable **Checkout Sessions → Write** in Stripe Dashboard.
 * Optional: **Checkout Sessions → Read** (resume an open session if the client resubmits).
 * We use `price_data` on Checkout (no Products / Prices API).
 * Webhooks use STRIPE_WEBHOOK_SECRET locally (no extra API permission).
 */
export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
  );
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { typescript: true });
}

export type StripeBookingPaymentMode = "deposit" | "full" | "off";

export function getStripeBookingPaymentMode(): StripeBookingPaymentMode {
  const raw = process.env.STRIPE_BOOKING_PAYMENT_MODE?.trim().toLowerCase();
  if (raw === "off" || raw === "false" || raw === "0") return "off";
  if (raw === "deposit") return "deposit";
  return "full";
}

export function getStripeDepositCents(): number {
  const n = Number(process.env.STRIPE_DEPOSIT_CENTS ?? 20000);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 20000;
}

export type StripeBookingConfig =
  | { enabled: false }
  | {
      enabled: true;
      mode: "deposit" | "full";
      depositCents: number;
      publishableKey: string;
    };

export function getStripeBookingConfig(): StripeBookingConfig {
  if (!isStripeConfigured()) return { enabled: false };
  const mode = getStripeBookingPaymentMode();
  if (mode === "off") return { enabled: false };
  return {
    enabled: true,
    mode,
    depositCents: getStripeDepositCents(),
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!.trim(),
  };
}

export type BookingAmountInput = {
  packageHelp?: boolean;
  packageSnapshot?: { name: string; priceCents: number };
  addOnSnapshots?: { name: string; priceCents: number }[];
};

export function computeBookingCheckoutCents(input: BookingAmountInput): number | null {
  if (!isStripeConfigured() || getStripeBookingPaymentMode() === "off") {
    return null;
  }

  const mode = getStripeBookingPaymentMode();

  if (mode === "full") {
    if (input.packageHelp || !input.packageSnapshot) {
      return null;
    }
    let total = input.packageSnapshot.priceCents;
    for (const a of input.addOnSnapshots ?? []) {
      total += a.priceCents;
    }
    return total > 0 ? total : null;
  }

  return getStripeDepositCents();
}
