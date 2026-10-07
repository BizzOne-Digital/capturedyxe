"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  title: string;
  listUrl: string;
  statusOptions: string[];
};

export function LeadsAdmin({ title, listUrl, statusOptions }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch(listUrl);
    const d = await res.json();
    setItems(d.items ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(listUrl);
      const d = await res.json();
      if (!cancelled) setItems(d.items ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [listUrl]);

  async function save() {
    if (!selected) return;
    const id = selected._id;
    const base = listUrl.replace(/\/$/, "");
    await fetch(`${base}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNotes: notes }),
    });
    setSelected(null);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">{title}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto text-sm">
          {items.map((item) => (
            <li key={String(item._id)}>
              <button
                type="button"
                className="w-full rounded-lg border border-ink/10 px-3 py-2 text-left hover:border-champagne"
                onClick={() => {
                  setSelected(item);
                  setNotes(String(item.internalNotes ?? ""));
                  setStatus(String(item.status ?? "new"));
                }}
              >
                <span className="font-medium">
                  {String(item.name ?? item.email)}
                </span>
                <span className="ml-2 text-taupe">{String(item.status)}</span>
              </button>
            </li>
          ))}
        </ul>
        {selected && (
          <div className="rounded-2xl border border-ink/10 bg-porcelain p-4 text-sm">
            <pre className="whitespace-pre-wrap text-xs text-taupe overflow-auto max-h-48">
              {JSON.stringify(selected, null, 2)}
            </pre>
            <label className="mt-4 block">
              Status
              <select
                className="mt-1 w-full rounded border px-3 py-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block">
              Internal notes
              <textarea
                className="mt-1 w-full rounded border px-3 py-2"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <Button type="button" className="mt-4" onClick={save}>Update</Button>
          </div>
        )}
      </div>
    </div>
  );
}
