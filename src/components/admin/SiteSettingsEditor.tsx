"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";

type Settings = {
  email: string;
  phone: string;
  serviceArea: string;
  instagramUrl: string;
  facebookUrl: string;
  tagline: string;
  startingPrice: string;
  showPublicPackagePrices: boolean;
  headline: string;
  subheadline: string;
  heroImageUrl: string;
};

const inputClass =
  "mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-2 text-sm focus:border-champagne focus:outline-none";

function toTel(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function SiteSettingsEditor() {
  const toast = useToast();
  const [data, setData] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          toast.error(d.error);
          return;
        }
        setData({
          email: d.email ?? "",
          phone: d.phone ?? "",
          serviceArea: d.serviceArea ?? "",
          instagramUrl: d.instagramUrl ?? "",
          facebookUrl: d.facebookUrl ?? "",
          tagline: d.tagline ?? "",
          startingPrice: String(Number(d.startingPriceCents ?? 0) / 100),
          showPublicPackagePrices: Boolean(d.showPublicPackagePrices),
          headline: d.headline ?? "",
          subheadline: d.subheadline ?? "",
          heroImageUrl: d.heroImageUrl ?? "",
        });
      })
      .catch(() => toast.error("Could not load settings."));
  }, [toast]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim(),
          phone: data.phone.trim(),
          phoneTel: toTel(data.phone),
          serviceArea: data.serviceArea,
          instagramUrl: data.instagramUrl.trim(),
          facebookUrl: data.facebookUrl.trim(),
          tagline: data.tagline,
          startingPriceCents: Math.round(Number(data.startingPrice || 0) * 100),
          showPublicPackagePrices: data.showPublicPackagePrices,
          headline: data.headline,
          subheadline: data.subheadline,
          heroImageUrl: data.heroImageUrl,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? "Could not save settings.");
        return;
      }
      toast.success("Settings saved. The website will update shortly.");
      setFormKey((k) => k + 1);
    } catch {
      toast.error("Could not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <p className="text-taupe">Loading…</p>;

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) =>
    setData((prev) => (prev ? { ...prev, [k]: v } : prev));

  const text = (k: keyof Settings, label: string, help?: string, type = "text") => (
    <label className="block text-sm">
      <span className="text-taupe">{label}</span>
      <input
        type={type}
        className={inputClass}
        value={String(data[k])}
        onChange={(e) => set(k, e.target.value as never)}
      />
      {help && <span className="mt-1 block text-xs text-taupe">{help}</span>}
    </label>
  );

  return (
    <form key={formKey} onSubmit={save} className="max-w-2xl space-y-8">
      <section className="space-y-4 rounded-2xl border border-ink/10 bg-porcelain p-5">
        <h2 className="font-display text-xl">Contact details</h2>
        {text("email", "Email", undefined, "email")}
        {text("phone", "Phone number", "Example: +1 639 480 6206")}
        {text("serviceArea", "Where you work")}
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-porcelain p-5">
        <h2 className="font-display text-xl">Social media</h2>
        {text("instagramUrl", "Instagram link", "Paste the full link. Leave empty to hide it.")}
        {text("facebookUrl", "Facebook link", "Paste the full link. Leave empty to hide it.")}
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-porcelain p-5">
        <h2 className="font-display text-xl">Homepage</h2>
        {text("headline", "Main headline")}
        {text("subheadline", "Text under the headline")}
        {text("tagline", "Tagline")}
        <ImageUploadField
          label="Main homepage photo"
          folder="pages"
          value={data.heroImageUrl}
          onChange={(url) => set("heroImageUrl", url)}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-ink/10 bg-porcelain p-5">
        <h2 className="font-display text-xl">Pricing display</h2>
        <label className="block text-sm">
          <span className="text-taupe">&quot;Starting from&quot; price</span>
          <div className="relative">
            <span className="absolute left-4 top-1/2 mt-0.5 -translate-y-1/2 text-taupe">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} pl-8`}
              value={data.startingPrice}
              onChange={(e) => set("startingPrice", e.target.value)}
            />
          </div>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.showPublicPackagePrices}
            onChange={(e) => set("showPublicPackagePrices", e.target.checked)}
          />
          Show package prices on the website
        </label>
      </section>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
