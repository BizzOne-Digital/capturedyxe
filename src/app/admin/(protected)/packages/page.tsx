import { PackagesManager, AddOnsManager } from "@/components/admin/managers";

export default function Page() {
  return (
    <div className="space-y-16">
      <PackagesManager />
      <AddOnsManager />
    </div>
  );
}
