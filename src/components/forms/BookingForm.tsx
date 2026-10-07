"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

type Pkg = { _id: string; name: string; slug: string };
type AddOn = { _id: string; name: string };

function newIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function BookingForm({
  packages,
  addOns,
  defaultEventType = "",
}: {
  packages: Pkg[];
  addOns: AddOn[];
  defaultEventType?: string;
}) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    eventType: defaultEventType,
    eventDate: "",
    eventTimeLocal: "18:00",
    venueName: "",
    venueAddress: "",
    venueNotConfirmed: false,
    guestCount: "",
    packageId: "",
    packageHelp: false,
    addOnIds: [] as string[],
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const steps = ["Event", "Package", "Contact", "Review"];

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const selectedPackage = useMemo(
    () => packages.find((p) => p._id === form.packageId),
    [packages, form.packageId]
  );

  async function submit() {
    setStatus("loading");
    setError("");
    const res = await fetch("/api/booking-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        guestCount: form.guestCount ? Number(form.guestCount) : undefined,
        sourcePage: "/booking",
        website: "",
        idempotencyKey: newIdempotencyKey(),
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(json.error ?? "Unable to submit. Please try again.");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-champagne/40 bg-porcelain p-8" role="status">
        <h2 className="font-display text-3xl">Request received</h2>
        <p className="mt-4 text-taupe">
          Your request has been received. Our team will contact you to confirm availability
          and details.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full max-w-full">
      <ol className="mb-8 flex flex-wrap gap-2" aria-label="Booking steps">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider ${
              step === i + 1 ? "bg-ink text-porcelain" : "bg-sand/70 text-taupe"
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-taupe">Event type *</span>
            <select
              value={form.eventType}
              onChange={(e) => update("eventType", e.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
            >
              <option value="">Select…</option>
              <option>Wedding</option>
              <option>Corporate Event</option>
              <option>Milestone Celebration</option>
              <option>Product Launch</option>
              <option>School Event</option>
              <option>Public Festival</option>
              <option>Christmas Party</option>
              <option>Other</option>
            </select>
          </label>
          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-taupe">Event date *</span>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
              />
            </label>
            <label className="block text-sm">
              <span className="text-taupe">Start time (Saskatoon) *</span>
              <input
                type="time"
                value={form.eventTimeLocal}
                onChange={(e) => update("eventTimeLocal", e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
              />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-taupe">
            <input
              type="checkbox"
              checked={form.venueNotConfirmed}
              onChange={(e) => update("venueNotConfirmed", e.target.checked)}
            />
            Venue not confirmed yet
          </label>
          {!form.venueNotConfirmed && (
            <>
              <label className="block text-sm">
                <span className="text-taupe">Venue name</span>
                <input
                  value={form.venueName}
                  onChange={(e) => update("venueName", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
                />
              </label>
              <label className="block text-sm">
                <span className="text-taupe">Venue city / address</span>
                <input
                  value={form.venueAddress}
                  onChange={(e) => update("venueAddress", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
                />
              </label>
            </>
          )}
          <label className="block text-sm">
            <span className="text-taupe">Approximate guest count</span>
            <input
              type="number"
              min={1}
              value={form.guestCount}
              onChange={(e) => update("guestCount", e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
            />
          </label>
          <Button type="button" onClick={() => setStep(2)} disabled={!form.eventType || !form.eventDate}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.packageHelp}
              onChange={(e) => update("packageHelp", e.target.checked)}
            />
            Help me choose a package
          </label>
          {!form.packageHelp && (
            <label className="block text-sm">
              <span className="text-taupe">Preferred package</span>
              <select
                value={form.packageId}
                onChange={(e) => update("packageId", e.target.value)}
                className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
              >
                <option value="">Select…</option>
                {packages.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </label>
          )}
          {addOns.length > 0 && (
            <fieldset className="text-sm">
              <legend className="text-taupe">Requested extras (optional)</legend>
              <div className="mt-2 space-y-2">
                {addOns.map((a) => (
                  <label key={a._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.addOnIds.includes(a._id)}
                      onChange={(e) => {
                        update(
                          "addOnIds",
                          e.target.checked
                            ? [...form.addOnIds, a._id]
                            : form.addOnIds.filter((id) => id !== a._id)
                        );
                      }}
                    />
                    {a.name}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button type="button" onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-taupe">Name *</span>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
            />
          </label>
          <label className="block text-sm">
            <span className="text-taupe">Email *</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
            />
          </label>
          <label className="block text-sm">
            <span className="text-taupe">Phone *</span>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
            />
          </label>
          <label className="block text-sm">
            <span className="text-taupe">Notes</span>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
            />
          </label>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button
              type="button"
              onClick={() => setStep(4)}
              disabled={!form.name || !form.email || !form.phone}
            >
              Review
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 text-sm text-taupe">
          <dl className="rounded-2xl border border-ink/10 bg-porcelain p-6 space-y-2">
            <div><dt className="text-ink font-medium">Event</dt><dd>{form.eventType} — {form.eventDate} at {form.eventTimeLocal}</dd></div>
            <div><dt className="text-ink font-medium">Venue</dt><dd>{form.venueNotConfirmed ? "To be confirmed" : `${form.venueName || "—"}, ${form.venueAddress || ""}`}</dd></div>
            <div><dt className="text-ink font-medium">Package</dt><dd>{form.packageHelp ? "Help me choose" : selectedPackage?.name ?? "—"}</dd></div>
            <div><dt className="text-ink font-medium">Contact</dt><dd>{form.name}, {form.email}, {form.phone}</dd></div>
          </dl>
          <p className="text-xs">Submitting requests availability — it does not reserve your date or process payment.</p>
          {error && <p className="text-red-700" role="alert">{error}</p>}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setStep(3)}>Back</Button>
            <Button type="button" onClick={submit} disabled={status === "loading"}>
              {status === "loading" ? "Submitting…" : "Submit Request"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
