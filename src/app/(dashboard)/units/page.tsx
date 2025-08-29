import { listUnitsAction } from "@/lib/actions/units.actions";
import UnitsTable from "./_components/UnitsTable";

export default async function UnitsPage() {
  const res = await listUnitsAction();
  const data = res.success ? res.data! : [];
  return <UnitsTable rows={data} error={res.success ? undefined : res.error} />;
}
