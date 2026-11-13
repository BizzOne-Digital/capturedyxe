import type { Model } from "mongoose";

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item"
  );
}

/** Build a slug from a title that does not collide with an existing document. */
export async function uniqueSlug(
  M: Model<unknown>,
  base: string,
  preferred?: string
): Promise<string> {
  const root = slugify(preferred || base);
  let candidate = root;
  let n = 2;
  while (await M.exists({ slug: candidate })) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}
