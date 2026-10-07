"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function SiteSettingsEditor() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setMessage("Failed to load settings"));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        phone: data.phone,
        phoneTel: data.phoneTel,
        serviceArea: data.serviceArea,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl,
        tagline: data.tagline,
        startingPriceCents: Number(data.startingPriceCents),
        showPublicPackagePrices: Boolean(data.showPublicPackagePrices),
        headline: data.headline,
        subheadline: data.subheadline,
        heroImageUrl: data.heroImageUrl,
        defaultSeoTitle: data.defaultSeoTitle,
        defaultSeoDescription: data.defaultSeoDescription,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setMessage("Save failed");
      return;
    }
    setMessage("Saved — public site will update shortly.");
  }

  if (!data) {
    return <p className="text-taupe">Loading…</p>;
  }

  const field = (key: string, label: string, type = "text") => (
    <label key={key} className="block text-sm">
      <span className="text-taupe">{label}</span>
      {type === "checkbox" ? (
        <input
          type="checkbox"
          className="ml-2"
          checked={Boolean(data[key])}
          onChange={(e) => setData({ ...data, [key]: e.target.checked })}
        />
      ) : (
        <input
          type={type}
          className="mt-1 w-full rounded-xl border border-ink/15 px-4 py-2"
          value={String(data[key] ?? "")}
          onChange={(e) =>
            setData({
              ...data,
              [key]: type === "number" ? Number(e.target.value) : e.target.value,
            })
          }
        />
      )}
    </label>
  );

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      {field("email", "Email")}
      {field("phone", "Phone display")}
      {field("phoneTel", "Phone tel: link")}
      {field("serviceArea", "Service area")}
      {field("instagramUrl", "Instagram URL (hidden on site until valid)")}
      {field("facebookUrl", "Facebook URL")}
      {field("tagline", "Tagline")}
      {field("startingPriceCents", "Starting price (cents)", "number")}
      {field("showPublicPackagePrices", "Show package prices publicly", "checkbox")}
      {field("headline", "Home headline")}
      {field("subheadline", "Home subheadline")}
      {field("heroImageUrl", "Hero image URL")}
      {field("defaultSeoTitle", "Default SEO title")}
      {field("defaultSeoDescription", "Default SEO description")}
      {message && <p className="text-sm text-champagne">{message}</p>}
      <Button type="submit" disabled={loading}>{loading ? "Saving…" : "Save settings"}</Button>
    </form>
  );
}
