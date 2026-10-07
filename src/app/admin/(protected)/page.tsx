import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { BookingRequest } from "@/models/BookingRequest";
import { Service } from "@/models/Service";
import { FAQ } from "@/models/FAQ";

export default async function AdminDashboardPage() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-4 text-taupe">
          Connect MongoDB Atlas to view live metrics and manage content.
        </p>
      </div>
    );
  }

  await connectDB();
  const [inquiries, bookings, services, faqs, newBookings] = await Promise.all([
    Inquiry.countDocuments(),
    BookingRequest.countDocuments(),
    Service.countDocuments({ status: "published" }),
    FAQ.countDocuments({ status: "published" }),
    BookingRequest.countDocuments({ status: "new" }),
  ]);

  const cards = [
    { label: "Total enquiries", value: inquiries },
    { label: "Booking requests", value: bookings },
    { label: "New bookings", value: newBookings },
    { label: "Published services", value: services },
    { label: "Published FAQs", value: faqs },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="mt-2 text-sm text-taupe">Metrics from your Atlas database.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-ink/10 bg-porcelain p-6"
          >
            <p className="text-sm text-taupe">{c.label}</p>
            <p className="mt-2 font-display text-4xl">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
