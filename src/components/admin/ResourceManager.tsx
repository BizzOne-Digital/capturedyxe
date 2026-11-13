"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUploadField, type UploadFolderName } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";
import { safeImageSrc } from "@/lib/image-src";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "money"
  | "select"
  | "checkbox"
  | "image"
  | "lines"
  | "date";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  folder?: UploadFolderName;
  /** For checkbox: text shown next to the box. */
  checkboxLabel?: string;
  /** Half-width on desktop. */
  half?: boolean;
};

type Item = Record<string, unknown>;
type Values = Record<string, unknown>;

type Props = {
  /** Plural heading, e.g. "Services" */
  title: string;
  /** Singular noun, e.g. "service" */
  noun: string;
  intro?: string;
  apiUrl: string;
  listKey?: string;
  fields: Field[];
  defaults?: Values;
  /** Main line in the list. */
  itemTitle: (item: Item) => string;
  /** Small line under the title. */
  itemSubtitle?: (item: Item) => string;
  /** Item key that holds a thumbnail URL. */
  thumbKey?: string;
  /** Key whose value is shown as a status chip (draft / published ...). */
  statusKey?: string;
  /** Convert a saved item into form values (default: use fields as-is). */
  toForm?: (item: Item) => Values;
  /** Convert form values into the payload sent to the API. */
  toPayload?: (values: Values) => Values;
  createBody?: (payload: Values) => unknown;
  updateUrl?: (id: string) => string;
  updateBody?: (payload: Values, id: string) => unknown;
  deleteUrl?: (id: string) => string;
};

export const STATUS_OPTIONS = [
  { value: "published", label: "Published (visible on the website)" },
  { value: "draft", label: "Draft (hidden, still being worked on)" },
  { value: "archived", label: "Archived (hidden, kept for later)" },
];

export const EVENT_CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate event" },
  { value: "milestone", label: "Milestone / birthday" },
  { value: "product-launch", label: "Product launch" },
  { value: "school", label: "School event" },
  { value: "festival", label: "Festival" },
];

const STATUS_LABEL: Record<string, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

function statusClass(s: string) {
  if (s === "published") return "bg-green-100 text-green-800";
  if (s === "draft") return "bg-amber-100 text-amber-800";
  return "bg-sand text-taupe";
}

function initialValues(fields: Field[], defaults: Values = {}): Values {
  const v: Values = {};
  for (const f of fields) {
    if (f.key in defaults) v[f.key] = defaults[f.key];
    else if (f.type === "checkbox") v[f.key] = false;
    else if (f.type === "lines") v[f.key] = [];
    else if (f.type === "number" || f.type === "money") v[f.key] = "";
    else v[f.key] = "";
  }
  return v;
}

function defaultToForm(fields: Field[], item: Item): Values {
  const v: Values = {};
  for (const f of fields) {
    const raw = item[f.key];
    if (f.type === "money") v[f.key] = raw == null ? "" : String(Number(raw) / 100);
    else if (f.type === "date") v[f.key] = raw ? String(raw).slice(0, 10) : "";
    else if (f.type === "lines") v[f.key] = Array.isArray(raw) ? raw.map(String) : [];
    else if (f.type === "checkbox") v[f.key] = Boolean(raw);
    else if (f.type === "number") v[f.key] = raw == null ? "" : String(raw);
    else v[f.key] = raw == null ? "" : String(raw);
  }
  return v;
}

function defaultToPayload(fields: Field[], values: Values): Values {
  const p: Values = {};
  for (const f of fields) {
    const raw = values[f.key];
    switch (f.type) {
      case "money": {
        const n = Number(raw);
        p[f.key] = Number.isFinite(n) ? Math.round(n * 100) : 0;
        break;
      }
      case "number": {
        if (raw === "" || raw == null) break;
        const n = Number(raw);
        if (Number.isFinite(n)) p[f.key] = n;
        break;
      }
      case "lines":
        p[f.key] = (Array.isArray(raw) ? raw : [])
          .map((s) => String(s).trim())
          .filter(Boolean);
        break;
      case "checkbox":
        p[f.key] = Boolean(raw);
        break;
      default:
        p[f.key] = typeof raw === "string" ? raw : String(raw ?? "");
    }
  }
  return p;
}

const inputClass =
  "mt-1 w-full rounded-xl border border-ink/15 bg-white px-4 py-2 text-sm focus:border-champagne focus:outline-none";

export function ResourceManager({
  title,
  noun,
  intro,
  apiUrl,
  listKey = "items",
  fields,
  defaults,
  itemTitle,
  itemSubtitle,
  thumbKey,
  statusKey,
  toForm,
  toPayload,
  createBody,
  updateUrl,
  updateBody,
  deleteUrl,
}: Props) {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [values, setValues] = useState<Values>(() => initialValues(fields, defaults));
  const [saving, setSaving] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not load the list.");
        return;
      }
      setItems((data[listKey] ?? []) as Item[]);
    } catch {
      toast.error("Could not load the list. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, listKey, toast]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          toast.error(data.error ?? "Could not load the list.");
        } else {
          setItems((data[listKey] ?? []) as Item[]);
        }
      } catch {
        if (!cancelled) toast.error("Could not load the list. Please refresh the page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, listKey, toast]);

  const selectedItem = useMemo(
    () => items.find((i) => String(i._id) === selectedId) ?? null,
    [items, selectedId]
  );

  function startNew() {
    setSelectedId("new");
    setValues(initialValues(fields, defaults));
    setFormKey((k) => k + 1);
  }

  function select(item: Item) {
    setSelectedId(String(item._id));
    setValues(toForm ? toForm(item) : defaultToForm(fields, item));
    setFormKey((k) => k + 1);
  }

  function setValue(key: string, v: unknown) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    for (const f of fields) {
      if (!f.required) continue;
      const v = values[f.key];
      const empty = f.type === "lines" ? !Array.isArray(v) || v.length === 0 : !String(v ?? "").trim();
      if (empty) {
        toast.error(`Please fill in: ${f.label}`);
        return;
      }
    }
    const payload = toPayload ? toPayload(values) : defaultToPayload(fields, values);
    const isNew = selectedId === "new";
    setSaving(true);
    try {
      let res: Response;
      if (isNew) {
        res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createBody ? createBody(payload) : payload),
        });
      } else {
        const id = String(selectedId);
        res = await fetch(updateUrl ? updateUrl(id) : `${apiUrl}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateBody ? updateBody(payload, id) : payload),
        });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Could not save. Please try again.");
        return;
      }
      toast.success(isNew ? `New ${noun} added.` : `${capitalize(noun)} saved.`);
      await load();
      if (isNew && data?._id) {
        setSelectedId(String(data._id));
      }
      setFormKey((k) => k + 1);
    } catch {
      toast.error("Could not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selectedItem) return;
    if (!confirm(`Delete this ${noun}? This cannot be undone.`)) return;
    const id = String(selectedItem._id);
    setSaving(true);
    try {
      const res = await fetch(deleteUrl ? deleteUrl(id) : `${apiUrl}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error(`Could not delete the ${noun}.`);
        return;
      }
      toast.success(`${capitalize(noun)} deleted.`);
      setSelectedId(null);
      await load();
    } catch {
      toast.error("Could not delete. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">{title}</h1>
          {intro && <p className="mt-2 max-w-2xl text-sm text-taupe">{intro}</p>}
        </div>
        <Button type="button" onClick={startNew}>
          <Plus className="h-4 w-4" aria-hidden /> Add {noun}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {loading && <li className="text-sm text-taupe">Loading…</li>}
          {!loading && items.length === 0 && (
            <li className="rounded-xl border border-dashed border-ink/20 p-6 text-sm text-taupe">
              Nothing here yet. Click &quot;Add {noun}&quot; to create the first one.
            </li>
          )}
          {items.map((item) => {
            const id = String(item._id);
            const active = id === selectedId;
            const status = statusKey ? String(item[statusKey] ?? "") : "";
            const thumb = thumbKey ? String(item[thumbKey] ?? "") : "";
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => select(item)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                    active
                      ? "border-champagne bg-sand/40"
                      : "border-ink/10 bg-porcelain hover:border-champagne"
                  }`}
                >
                  {thumbKey && (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sand/40">
                      {thumb && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={safeImageSrc(thumb)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{itemTitle(item) || "(untitled)"}</span>
                    {itemSubtitle && (
                      <span className="block truncate text-xs text-taupe">{itemSubtitle(item)}</span>
                    )}
                  </span>
                  {status && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${statusClass(status)}`}>
                      {STATUS_LABEL[status] ?? status}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div>
          {selectedId === null ? (
            <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-sm text-taupe">
              Select an item from the list to edit it, or click &quot;Add {noun}&quot; to create a new one.
            </div>
          ) : (
            <form
              key={formKey}
              onSubmit={save}
              className="space-y-4 rounded-2xl border border-ink/10 bg-porcelain p-5"
            >
              <h2 className="font-display text-xl">
                {selectedId === "new" ? `New ${noun}` : `Edit ${noun}`}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                    <FieldInput field={f} value={values[f.key]} onChange={(v) => setValue(f.key, v)} />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : selectedId === "new" ? `Add ${noun}` : "Save changes"}
                </Button>
                {selectedId !== "new" && (
                  <Button type="button" variant="secondary" onClick={remove} disabled={saving}>
                    <Trash2 className="h-4 w-4" aria-hidden /> Delete
                  </Button>
                )}
                <Button type="button" variant="secondary" onClick={() => setSelectedId(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function FieldInput({
  field: f,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = (
    <span className="text-taupe">
      {f.label}
      {f.required && <span className="text-red-700"> *</span>}
    </span>
  );
  const help = f.help ? <span className="mt-1 block text-xs text-taupe">{f.help}</span> : null;

  switch (f.type) {
    case "image":
      return (
        <ImageUploadField
          label={f.label}
          help={f.help}
          folder={f.folder}
          value={String(value ?? "")}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>
            {f.checkboxLabel ?? f.label}
            {f.help && <span className="block text-xs text-taupe">{f.help}</span>}
          </span>
        </label>
      );
    case "textarea":
      return (
        <label className="block text-sm">
          {label}
          <textarea
            className={inputClass}
            rows={f.rows ?? 4}
            placeholder={f.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </label>
      );
    case "lines":
      return (
        <label className="block text-sm">
          {label}
          <textarea
            className={inputClass}
            rows={f.rows ?? 5}
            placeholder={f.placeholder ?? "One item per line"}
            value={Array.isArray(value) ? value.join("\n") : ""}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
          {help ?? <span className="mt-1 block text-xs text-taupe">Type one item per line.</span>}
        </label>
      );
    case "select":
      return (
        <label className="block text-sm">
          {label}
          <select
            className={inputClass}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          >
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </label>
      );
    case "money":
      return (
        <label className="block text-sm">
          {label}
          <div className="relative">
            <span className="absolute left-4 top-1/2 mt-0.5 -translate-y-1/2 text-taupe">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} pl-8`}
              value={String(value ?? "")}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          {help}
        </label>
      );
    case "number":
      return (
        <label className="block text-sm">
          {label}
          <input
            type="number"
            className={inputClass}
            placeholder={f.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </label>
      );
    case "date":
      return (
        <label className="block text-sm">
          {label}
          <input
            type="date"
            className={inputClass}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </label>
      );
    default:
      return (
        <label className="block text-sm">
          {label}
          <input
            type="text"
            className={inputClass}
            placeholder={f.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </label>
      );
  }
}
