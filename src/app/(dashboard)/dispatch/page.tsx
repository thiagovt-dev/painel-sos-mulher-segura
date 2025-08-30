import { listUnitsAction } from "@/lib/actions/units.actions";
import DispatchView from "./_components/DispatchView";

export default async function DispatchPage() {
  const unitsRes = await listUnitsAction();
  const units = unitsRes.success ? unitsRes.data! : [];
  return <DispatchView units={units} />;
}
