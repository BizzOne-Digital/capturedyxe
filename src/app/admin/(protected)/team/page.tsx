import { JsonCrudPanel } from "@/components/admin/JsonCrudPanel";

export default function AdminTeamPage() {
  return (
    <JsonCrudPanel title="Team" listUrl="/api/admin/team" createUrl="/api/admin/team" />
  );
}
