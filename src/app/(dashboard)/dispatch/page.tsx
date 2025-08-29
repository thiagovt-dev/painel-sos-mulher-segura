import { listDispatchByUnitAction } from "@/lib/actions/dispatch.actions";
import DispatchTable from "./_components/DispatchTable";

export default async function DispatchPage() {
  // TODO: obter unitId do usuário logado ou via filtro
  const unitId = "aaaa1111-bbbb-2222-cccc-3333dddd4444";
  const res = await listDispatchByUnitAction({ unitId, dispatchStatus: "PENDING", incidentStatus: "OPEN" });
  return <DispatchTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} />;
}
