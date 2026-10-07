"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

function newIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function ContactForm({ sourcePage = "/contact" }: { sourcePage?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      eventType: String(data.get("eventType") ?? ""),
      eventDate: String(data.get("eventDate") ?? ""),
      message: String(data.get("message") ?? ""),
      sourcePage,
      website: String(data.get("website") ?? ""),
      idempotencyKey: newIdempotencyKey(),
    };

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    setStatus("success");
    form.reset();
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-champagne/40 bg-porcelain p-6" role="status">
        <p className="font-medium text-ink">Thank you — your message has been received.</p>
        <p className="mt-2 text-sm text-taupe">Our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-taupe">Name *</span>
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
          />
        </label>
        <label className="block text-sm">
          <span className="text-taupe">Email *</span>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-taupe">Phone (optional)</span>
        <input
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-taupe">Event type *</span>
          <select
            name="eventType"
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
            <option>Other</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-taupe">Event date (optional)</span>
          <input
            name="eventDate"
            type="date"
            className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-taupe">Message *</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-porcelain px-4 py-3"
        />
      </label>
      {error && (
        <p className="text-sm text-red-700" role="alert">{error}</p>
      )}
      <Button type="submit" disabled={status === "loading"} className="w-full md:w-auto">
        {status === "loading" ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
