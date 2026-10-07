import { JsonCrudPanel } from "@/components/admin/JsonCrudPanel";

export default function AdminServicesPage() {
  return (
    <JsonCrudPanel
      title="Services"
      listUrl="/api/admin/services"
      createUrl="/api/admin/services"
    />
  );
}
