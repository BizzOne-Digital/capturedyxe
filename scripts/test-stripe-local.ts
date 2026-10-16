/**
 * Quick local Stripe check — creates a real Checkout session (cancel in Dashboard if live).
 * Run: npx tsx scripts/test-stripe-local.ts
 */
import "dotenv/config";
import { getStripeBookingConfig, isStripeConfigured } from "../src/lib/stripe";
import { createBookingCheckoutSession } from "../src/lib/stripe-booking";

async function main() {
  console.log("isStripeConfigured:", isStripeConfigured());
  const cfg = getStripeBookingConfig();
  if (cfg.enabled) {
    console.log("booking config:", {
      enabled: true,
      mode: cfg.mode,
      depositCents: cfg.depositCents,
      publishableKey: cfg.publishableKey.slice(0, 12) + "...",
    });
  } else {
    console.log("booking config:", cfg);
  }
  console.log("STRIPE_WEBHOOK_SECRET:", process.env.STRIPE_WEBHOOK_SECRET ? "set" : "MISSING (webhook only)");

  if (!isStripeConfigured()) {
    console.error("FAIL: Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env");
    process.exit(1);
  }

  const session = await createBookingCheckoutSession(
    "local-test-" + Date.now(),
    "stripe-test@example.com",
    { packageHelp: true }
  );

  if (!session?.url) {
    console.error("FAIL: Checkout session was not created (null URL).");
    process.exit(1);
  }

  console.log("OK: Checkout session created.");
  console.log("  sessionId:", session.sessionId);
  console.log("  amountCents:", session.amountCents);
  console.log("  url:", session.url);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error("FAIL: Stripe API error:", msg);
  process.exit(1);
});
