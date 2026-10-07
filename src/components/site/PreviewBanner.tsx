import { isPreviewMode } from "@/lib/data/public";

export function PreviewBanner() {
  if (!isPreviewMode()) return null;
  return (
    <div
      className="w-full border-b border-champagne/40 bg-sand/80 px-4 py-2 text-center text-xs leading-relaxed text-taupe break-words"
      role="status"
    >
      Local preview mode — connect MongoDB Atlas in <code className="text-ink">.env</code> for
      live content and form persistence. Admin mutations are disabled without a database.
    </div>
  );
}
