"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function OffersAdmin() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/admin/offers").then((r) => r.json()).then((d) => setItems(d.items ?? []));
  }, []);

  async function save() {
    if (!selected) return;
    await fetch("/api/admin/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected._id, ...selected }),
    });
    const res = await fetch("/api/admin/offers");
    const d = await res.json();
    setItems(d.items ?? []);
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Offers</h1>
      <ul className="mt-6 space-y-2">
        {items.map((o) => (
          <li key={String(o._id)}>
            <button
              type="button"
              className="text-left text-sm underline"
              onClick={() => setSelected(o)}
            >
              {String(o.title)}
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div className="mt-8 max-w-xl space-y-3">
          {["title", "description", "eligibility", "notes"].map((k) => (
            <label key={k} className="block text-sm">
              {k}
              <input
                className="mt-1 w-full rounded border px-3 py-2"
                value={String(selected[k] ?? "")}
                onChange={(e) => setSelected({ ...selected, [k]: e.target.value })}
              />
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(selected.visible)}
              onChange={(e) => setSelected({ ...selected, visible: e.target.checked })}
            />
            Visible on homepage
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(selected.active)}
              onChange={(e) => setSelected({ ...selected, active: e.target.checked })}
            />
            Active
          </label>
          <Button type="button" onClick={save}>Save offer</Button>
        </div>
      )}
    </div>
  );
}
