import { JsonCrudPanel } from "@/components/admin/JsonCrudPanel";

export default function AdminGalleryPage() {
  return (
    <JsonCrudPanel
      title="Gallery"
      listUrl="/api/admin/gallery"
      createUrl="/api/admin/gallery"
    />
  );
}
