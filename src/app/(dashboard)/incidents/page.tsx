import { listIncidentsAction } from "@/lib/actions/incidents.actions";
import IncidentsTable from "./_components/IncidentsTable";

export default async function IncidentsPage() {
  const res = await listIncidentsAction({ status: "OPEN" });
  const data = res.success ? res.data! : [];
  return <IncidentsTable rows={data} error={res.success ? undefined : res.error} />;
}
