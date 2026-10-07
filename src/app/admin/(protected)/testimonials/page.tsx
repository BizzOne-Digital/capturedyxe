import { JsonCrudPanel } from "@/components/admin/JsonCrudPanel";

export default function AdminTestimonialsPage() {
  return (
    <JsonCrudPanel
      title="Testimonials"
      listUrl="/api/admin/testimonials"
      createUrl="/api/admin/testimonials"
    />
  );
}
