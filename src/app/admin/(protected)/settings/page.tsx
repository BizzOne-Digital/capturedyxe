import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl">Site settings</h1>
      <p className="mb-6 text-sm text-taupe">
        Contact details, social links, homepage text and the main homepage photo.
      </p>
      <SiteSettingsEditor />
    </div>
  );
}
