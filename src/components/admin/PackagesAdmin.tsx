import { JsonCrudPanel } from "@/components/admin/JsonCrudPanel";

export function PackagesAdmin() {
  return (
    <div className="space-y-12">
      <JsonCrudPanel
        title="Packages"
        listUrl="/api/admin/packages"
        createUrl="/api/admin/packages"
        itemKey="packages"
      />
      <p className="text-xs text-taupe">
        Add-ons can be created via POST to /api/admin/packages with body{" "}
        <code>{`{ "type": "addon", "data": { ... } }`}</code> using the API or seed script.
      </p>
    </div>
  );
}
