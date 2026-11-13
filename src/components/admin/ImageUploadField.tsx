"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { safeImageSrc } from "@/lib/image-src";

export type UploadFolderName = "products" | "gallery" | "pages" | "misc";

type Props = {
  label?: string;
  help?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolderName;
};

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Upload an image to /api/upload (stored in MongoDB, works on Vercel) and
 * return the public URL through onChange. Nothing is written to disk.
 */
export function ImageUploadField({
  label = "Photo",
  help,
  value,
  onChange,
  folder = "misc",
}: Props) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // Files uploaded in this editing session that are not saved yet.
  const freshUrls = useRef<Set<string>>(new Set());

  async function discardIfUnsaved(url: string) {
    if (!freshUrls.current.has(url)) return;
    freshUrls.current.delete(url);
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => {});
  }

  async function handleFile(file: File) {
    if (!ACCEPT.split(",").includes(file.type)) {
      toast.error("Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("That image is too large. Please choose one under 8 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        toast.error(data.error ?? "Upload failed. Please try again.");
        return;
      }
      const previous = value;
      freshUrls.current.add(data.url);
      onChange(data.url);
      if (previous) void discardIfUnsaved(previous);
      toast.success("Photo uploaded. Remember to save.");
    } catch {
      toast.error("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove() {
    if (value) void discardIfUnsaved(value);
    onChange("");
  }

  const hasImage = Boolean(value);

  return (
    <div className="text-sm">
      <span className="text-taupe">{label}</span>
      <div className="mt-1 flex items-center gap-4 rounded-xl border border-ink/15 bg-white p-3">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-sand/40">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={safeImageSrc(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-taupe">
              <ImagePlus className="h-6 w-6" aria-hidden />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/50 text-porcelain">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            </div>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-champagne/60 px-4 py-1.5 text-sm hover:bg-sand/40 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : hasImage ? "Replace photo" : "Choose photo"}
          </button>
          {hasImage && !uploading && (
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-1 text-xs text-red-700 hover:underline"
            >
              <Trash2 className="h-3 w-3" aria-hidden /> Remove photo
            </button>
          )}
          <p className="text-xs text-taupe">{help ?? "JPG, PNG, WEBP or GIF. Max 8 MB."}</p>
        </div>
      </div>
    </div>
  );
}
