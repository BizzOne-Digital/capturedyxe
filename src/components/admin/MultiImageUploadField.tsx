"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { safeImageSrc } from "@/lib/image-src";
import type { UploadFolderName } from "@/components/admin/ImageUploadField";

type Props = {
  label?: string;
  help?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: UploadFolderName;
};

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const MAX_BYTES = 8 * 1024 * 1024;

/** Upload several photos to /api/upload and keep the list of returned URLs. */
export function MultiImageUploadField({ label = "Photos", help, value, onChange, folder = "pages" }: Props) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const fresh = useRef<Set<string>>(new Set());

  async function handleFiles(files: File[]) {
    setUploading(true);
    const added: string[] = [];
    try {
      for (const file of files) {
        if (!ACCEPT.split(",").includes(file.type)) {
          toast.error(`${file.name}: please choose a JPG, PNG, WEBP or GIF image.`);
          continue;
        }
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} is larger than 8 MB.`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd }).catch(() => null);
        const data = res ? await res.json().catch(() => ({})) : {};
        if (!res || !res.ok || !data?.success) {
          toast.error(data?.error ?? `${file.name} failed to upload.`);
          continue;
        }
        fresh.current.add(data.url);
        added.push(data.url);
      }
      if (added.length) {
        onChange([...value, ...added]);
        toast.success(`${added.length} photo${added.length > 1 ? "s" : ""} uploaded. Remember to save.`);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
    // Photos uploaded in this session and never saved can be deleted right away.
    if (fresh.current.delete(url)) {
      void fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      }).catch(() => {});
    }
  }

  return (
    <div className="text-sm">
      <span className="text-taupe">{label}</span>
      <div className="mt-1 rounded-xl border border-ink/15 bg-white p-3">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg bg-sand/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={safeImageSrc(url)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-porcelain hover:bg-ink"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </div>
          ))}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-champagne/70 text-taupe hover:bg-sand/40 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="h-5 w-5" aria-hidden />
            )}
            <span className="text-xs">{uploading ? "Uploading…" : "Add photos"}</span>
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) void handleFiles(files);
          }}
        />
        <p className="mt-2 text-xs text-taupe">
          {help ?? "JPG, PNG, WEBP or GIF. Max 8 MB each. You can select several at once."}
        </p>
      </div>
    </div>
  );
}
