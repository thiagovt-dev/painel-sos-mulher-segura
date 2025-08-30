import DashboardMetrics from "./_components/DashboardMetrics";
import { listIncidentsAction } from "@/lib/actions/incidents.actions";
import { listUnitsAction } from "@/lib/actions/units.actions";

export default async function DashboardHome() {
  const [openRes, inDispatchRes, resolvedRes, unitsRes] = await Promise.all([
    listIncidentsAction({ status: "OPEN" }),
    listIncidentsAction({ status: "IN_DISPATCH" }),
    listIncidentsAction({ status: "RESOLVED" }),
    listUnitsAction(),
  ]);
  return (
    <div style={{ marginTop: 32, marginBottom: 32 }}>
      <DashboardMetrics 
        open={openRes.success ? openRes.data! : []}
        inDispatch={inDispatchRes.success ? inDispatchRes.data! : []}
        resolved={resolvedRes.success ? resolvedRes.data! : []}
        units={unitsRes.success ? unitsRes.data! : []}
      />
    </div>
  );
}
