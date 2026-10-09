/**
 * Copies client reference photography from Cursor assets into public/.
 * Run: npx tsx scripts/restore-client-brand-assets.ts
 */
import fs from "fs";
import path from "path";

const ASSETS =
  "C:/Users/admin/.cursor/projects/e-2sri-nokri-captured/assets";
const PUBLIC = path.join(process.cwd(), "public");
const IMAGES = path.join(PUBLIC, "images");

const map: Record<string, string> = {
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-fcb0839d-43a1-4d89-9dae-1b8341005a22.jpg":
    "../hero-booth.jpg",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-bc4292ba-df40-45f3-8239-27ed38da479f.jpg":
    "booth-gallery-arch.jpg",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-09a5656d-76a2-47f5-b29e-ad097583de5c.jpg":
    "booth-detail.jpg",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-1efed655-4e0d-4a2b-a792-b6bda9c87090.jpg":
    "wedding-banquet.jpg",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-12f0b6a5-d1ed-4bec-a4a4-3716f893c2b8.jpg":
    "corporate-gala.jpg",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-b964ef29-ab67-41e0-aa20-92606d9b01d2.jpg":
    "wedding-balloons.jpg",
  "c__Users_admin_AppData_Roaming_Cursor_User_workspaceStorage_b2f729880d106e8781065481d1acb17c_images_image-3ffdf198-5fac-4a1d-9d3b-8eb1f1375f02.jpg":
    "../logo-source.jpg",
};

fs.mkdirSync(IMAGES, { recursive: true });

for (const [file, destRel] of Object.entries(map)) {
  const src = path.join(ASSETS, file);
  const dest = path.resolve(IMAGES, destRel);
  if (!fs.existsSync(src)) {
    console.warn("Skip (missing):", file);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log("Copied →", path.relative(PUBLIC, dest));
}
