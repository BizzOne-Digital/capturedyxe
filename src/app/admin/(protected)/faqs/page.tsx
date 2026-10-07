import { JsonCrudPanel } from "@/components/admin/JsonCrudPanel";

export default function AdminFaqsPage() {
  return (
    <JsonCrudPanel title="FAQs" listUrl="/api/admin/faqs" createUrl="/api/admin/faqs" />
  );
}
