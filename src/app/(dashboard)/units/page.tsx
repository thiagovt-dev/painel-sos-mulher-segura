import { listUnitsAction } from "@/lib/actions/units.actions";
import UnitsTable from "./_components/UnitsTable";

export default async function UnitsPage() {
  const res = await listUnitsAction();
  return <UnitsTable rows={res.success ? res.data! : []} error={res.success ? undefined : res.error} />;
}
