import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Booking payment received" };

export default function BookingSuccessPage() {
  return (
    <section className="section-y">
      <div className="mx-auto max-w-xl px-4 text-center md:px-8">
        <Reveal>
          <h1 className="font-display text-4xl md:text-5xl">Payment received</h1>
          <p className="mt-4 text-taupe">
            Thank you — your payment was submitted through Stripe. Our team will contact you to
            confirm your date and any remaining details.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ButtonLink href="/">Back to home</ButtonLink>
            <Link href="/contact" className="text-sm text-champagne underline underline-offset-4">
              Contact us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
