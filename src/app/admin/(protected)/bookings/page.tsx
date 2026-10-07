import { LeadsAdmin } from "@/components/admin/LeadsAdmin";

export default function AdminBookingsPage() {
  return (
    <LeadsAdmin
      title="Booking requests"
      listUrl="/api/admin/bookings"
      statusOptions={[
        "new",
        "contacted",
        "awaiting_confirmation",
        "confirmed",
        "completed",
        "cancelled",
      ]}
    />
  );
}
