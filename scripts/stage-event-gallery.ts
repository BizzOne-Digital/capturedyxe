/**
 * Copies web-friendly JPEGs from client event folders into public/gallery/events/.
 * Skips Videos, Originals, Animated, and files over 8MB (GitHub-friendly).
 * Writes src/data/event-gallery-staged.json for the site to import.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { basename, join } from "path";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PER_ALBUM = 12;
const SKIP_DIRS = new Set(["videos", "originals", "animated", "greenscreen", "thumb"]);

const EVENT_SOURCES: { slug: string; sourceDir: string }[] = [
  {
    slug: "amber-yehya",
    sourceDir: join(
      process.cwd(),
      "public",
      "Amber and Yehya 09.27.2026-20261009T214701Z-1-001"
    ),
  },
];

function walkPrints(dir: string, out: string[]) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name.toLowerCase())) continue;
      walkPrints(full, out);
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      out.push(full);
    }
  }
}

function main() {
  const manifest: Record<string, string[]> = {};

  for (const { slug, sourceDir } of EVENT_SOURCES) {
    const destDir = join(process.cwd(), "public", "gallery", "events", slug);
    mkdirSync(destDir, { recursive: true });

    const files: string[] = [];
    walkPrints(sourceDir, files);

    const prints = files
      .filter((f) => !/thumb_/i.test(f))
      .filter((f) => statSync(f).size <= MAX_BYTES)
      .sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs);

    const staged: string[] = [];
    let n = 0;
    for (const src of prints.slice(0, MAX_PER_ALBUM)) {
      n += 1;
      const filename = `print-${String(n).padStart(2, "0")}.jpg`;
      const dest = join(destDir, filename);
      copyFileSync(src, dest);
      staged.push(filename);
      console.log(`[${slug}] ${basename(src)} → public/gallery/events/${slug}/${filename}`);
    }

    manifest[slug] = staged;

    if (staged.length === 0) {
      console.warn(`[${slug}] No suitable images under ${sourceDir}`);
    }
  }

  const manifestPath = join(process.cwd(), "src", "data", "event-gallery-staged.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${manifestPath}`);
  console.log("Run npm run seed to sync MongoDB gallery items.");
}

main();
