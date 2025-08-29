import { listIncidentsAction, closeIncidentAction, cancelIncidentAction } from "@/lib/actions/incidents.actions";
import IncidentsTable from "./_components/IncidentsTable";

export default async function IncidentsPage() {
  const res = await listIncidentsAction(); 
  return <IncidentsTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} onClose={closeIncidentAction} onCancel={cancelIncidentAction} />;
}
