/**
 * One-off: remove solid beige background from header lockup PNG.
 * Run: npx tsx scripts/make-header-logo-transparent.ts [input.png]
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const defaultInput = path.join(
  process.cwd(),
  "assets",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-7870f250-3257-4924-8862-09b074bd2075.png"
);
const input = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
const output = path.join(process.cwd(), "public", "logo", "Captured-yxe-header.png");

function colorDist(r: number, g: number, b: number, br: number, bg: number, bb: number) {
  return Math.hypot(r - br, g - bg, b - bb);
}

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const corners = [
    0,
    (w - 1) * 4,
    (h - 1) * w * 4,
    ((h - 1) * w + (w - 1)) * 4,
  ];
  let br = 0;
  let bg = 0;
  let bb = 0;
  for (const i of corners) {
    br += data[i];
    bg += data[i + 1];
    bb += data[i + 2];
  }
  br = Math.round(br / corners.length);
  bg = Math.round(bg / corners.length);
  bb = Math.round(bb / corners.length);

  const threshold = 42;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (colorDist(r, g, b, br, bg, bb) <= threshold) {
      data[i + 3] = 0;
    }
  }

  const png = await sharp(data, {
    raw: { width: w, height: h, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  writeFileSync(output, png);
  console.log("Wrote", output, `${w}x${h}`, "bg sample", [br, bg, bb]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
