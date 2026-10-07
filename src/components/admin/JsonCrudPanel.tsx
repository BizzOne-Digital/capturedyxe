"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  title: string;
  listUrl: string;
  createUrl?: string;
  itemKey?: string;
  idField?: string;
};

export function JsonCrudPanel({
  title,
  listUrl,
  createUrl,
  itemKey = "items",
  idField = "_id",
}: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [json, setJson] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch(listUrl);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load");
      return;
    }
    const list = data[itemKey] ?? data.packages ?? [];
    setItems(list);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await fetch(listUrl);
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok) {
        setError(data.error ?? "Failed to load");
        return;
      }
      const list = data[itemKey] ?? data.packages ?? [];
      setItems(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [listUrl, itemKey]);

  async function save() {
    if (!selected) return;
    setError("");
    let body: unknown;
    try {
      body = JSON.parse(json);
    } catch {
      setError("Invalid JSON");
      return;
    }
    const id = selected[idField];
    const payload =
      body && typeof body === "object"
        ? Object.fromEntries(
            Object.entries(body as Record<string, unknown>).filter(
              ([k]) => !["_id", "__v", "createdAt", "updatedAt"].includes(k)
            )
          )
        : body;
    const res = await fetch(`${listUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Save failed");
      return;
    }
    await load();
  }

  async function create() {
    if (!createUrl) return;
    setError("");
    let body: unknown;
    try {
      body = JSON.parse(json);
    } catch {
      setError("Invalid JSON for create");
      return;
    }
    const res = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Create failed");
      return;
    }
    setJson("");
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const base = listUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    setSelected(null);
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-3xl">{title}</h1>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
          {items.map((item) => {
            const id = String(item[idField]);
            const label =
              String(item.title ?? item.name ?? item.question ?? item.reviewerName ?? id);
            return (
              <li key={id}>
                <button
                  type="button"
                  className="w-full rounded-lg border border-ink/10 bg-porcelain px-3 py-2 text-left text-sm hover:border-champagne"
                  onClick={() => {
                    setSelected(item);
                    setJson(JSON.stringify(item, null, 2));
                  }}
                >
                  {label}
                  {"status" in item && item.status != null && (
                    <span className="ml-2 text-xs text-taupe">({String(item.status)})</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <div>
          <textarea
            className="h-80 w-full rounded-xl border border-ink/15 p-3 font-mono text-xs"
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {selected && (
              <>
                <Button type="button" onClick={save}>Save changes</Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => remove(String(selected[idField]))}
                >
                  Delete
                </Button>
              </>
            )}
            {createUrl && (
              <Button type="button" variant="secondary" onClick={create}>
                Create from JSON
              </Button>
            )}
          </div>
          <p className="mt-4 text-xs text-taupe">
            Edit fields as JSON. Remove read-only keys like _id and __v before creating new records.
          </p>
        </div>
      </div>
    </div>
  );
}
