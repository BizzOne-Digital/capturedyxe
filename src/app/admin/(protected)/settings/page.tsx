import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Site settings</h1>
      <p className="mb-6 text-sm text-taupe">
        Contact details, social links, homepage copy, and SEO defaults used across the public site.
      </p>
      <SiteSettingsEditor />
    </div>
  );
}
