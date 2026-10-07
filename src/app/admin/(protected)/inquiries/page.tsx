import { LeadsAdmin } from "@/components/admin/LeadsAdmin";

export default function AdminInquiriesPage() {
  return (
    <LeadsAdmin
      title="Enquiries"
      listUrl="/api/admin/inquiries"
      statusOptions={["new", "contacted", "closed"]}
    />
  );
}
