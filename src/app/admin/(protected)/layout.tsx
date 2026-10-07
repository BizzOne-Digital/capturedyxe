import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionAdminId } from "@/lib/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminId = await getSessionAdminId();
  if (!adminId) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
